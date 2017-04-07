package group13.bigdata.youtubedatastream;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;

import java.util.Properties;
import java.util.Scanner;

/**
 * Created by Akarsh Gupta
 */
public class YoutubeDataProducer {

	Properties configProperties;

	public YoutubeDataProducer() {
		// Configure the Producer
		configProperties = new Properties();
		configProperties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
		configProperties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
				"org.apache.kafka.common.serialization.ByteArraySerializer");
		configProperties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
				"org.apache.kafka.common.serialization.StringSerializer");

	}

	public void produceYouTubeData(String topicName, String data) {
		Producer producer = new KafkaProducer(configProperties);
		ProducerRecord<String, String> rec = new ProducerRecord<String, String>(topicName, data);
		producer.send(rec);
		producer.close();
	}

}
