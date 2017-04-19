package group13.bigdata.youtubedataprocessingspark

import org.apache.kafka.clients.consumer.{ ConsumerConfig, KafkaConsumer };
import kafka.utils.Logging;
import kafka.consumer.KafkaStream;
import org.apache.kafka.common.serialization.StringDeserializer;
import java.util.concurrent._;
import scala.collection._;
import java.util.Properties;
import org.apache.spark._;
import org.apache.spark.streaming._;
import org.apache.spark.streaming.kafka010._;
import org.apache.spark.streaming.kafka010.LocationStrategies.PreferConsistent;
import org.apache.spark.streaming.kafka010.ConsumerStrategies.Subscribe;
import org.apache.spark.sql._;
import org.apache.spark.sql.functions._;
import org.apache.spark.sql.DataFrame;
import com.databricks.spark.corenlp.functions._;
import redis.clients.jedis.Jedis

/**
 * @author ${user.name}
 */
object App {

  val config = new SparkConf().setAppName("youtube-sentimental-analysis").setMaster("local[2]").set("spark.driver.host", "localhost");
  val sparkContext = new SparkContext(config);
  val sqlContext = new SQLContext(sparkContext);

  import sqlContext.implicits._;

  def main(args: Array[String]) {

    val kafkaParams = Map[String, Object](
      "bootstrap.servers" -> "localhost:9092",
      "key.deserializer" -> classOf[StringDeserializer],
      "value.deserializer" -> classOf[StringDeserializer],
      "group.id" -> "group.id=test-consumer-group",
      "auto.offset.reset" -> "latest");

    val topic = Array("test");

    sparkContext.setLogLevel("WARN");

    val streamingSparkContext = new StreamingContext(sparkContext, Seconds(3));
    val stream = KafkaUtils.createDirectStream[String, String](
      streamingSparkContext,
      PreferConsistent,
      Subscribe[String, String](topic, kafkaParams));

    stream.foreachRDD(rdd => {
      println("rdd partition size" + rdd.partitions.size + "with" + rdd.count());
      val xyz = rdd.map(record => record.value().split('|'))
        .map(x => (x(0), x(1), x(2), x(3)))
        .toDF("videoId", "videoTitle", "videoDescription", "comment")
        .withColumn("commentSentimentScore", sentiment(col("comment")))
        .groupBy("videoId", "videoTitle", "videoDescription")
        .agg(avg($"commentSentimentScore").as("videoSentimentScore"));
      if (xyz.count() > 0) {
        xyz.foreach { row => 
            val message = (row.getAs("videoId"),row.getAs("videoTitle"),row.getAs("videoDescription"),row.getAs("videoSentimentScore"))
            val jedis = new Jedis("localhost", 6379);
            val pipleline = jedis.pipelined();
            val write = message.productIterator.mkString("|");
            val publishMessage = pipleline.publish("YouTube", write);
            pipleline.sync();
        
        }
      }

    });

    streamingSparkContext.start();
    streamingSparkContext.awaitTermination();
  }

}
