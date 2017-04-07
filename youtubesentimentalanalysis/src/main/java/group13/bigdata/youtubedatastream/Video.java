package group13.bigdata.youtubedatastream;

import group13.bigdata.youtubedatastream.*;
import java.util.ArrayList;

public class Video {

	private String videoId;
	private String videoTitle;
	private String videoDesc ;
	private ArrayList<Comment> comments;
	
	public Video(String videoId, String videoTitle, String videoDesc, ArrayList<Comment> comments) {
		this.videoId = videoId;
		this.videoTitle = videoTitle;
		this.videoDesc = videoDesc;
		this.comments = comments;
	}
	public String getVideoId() {
		return videoId;
	}
	public void setVideoId(String videoId) {
		this.videoId = videoId;
	}
	public String getVideoTitle() {
		return videoTitle;
	}
	public void setVideoTitle(String videoTitle) {
		this.videoTitle = videoTitle;
	}
	public String getVideoDesc() {
		return videoDesc;
	}
	public void setVideoDesc(String videoDesc) {
		this.videoDesc = videoDesc;
	}
	public ArrayList<Comment> getComments() {
		return comments;
	}
	public void setComments(ArrayList<Comment> comments) {
		this.comments = comments;
	}
	
	
	
}
