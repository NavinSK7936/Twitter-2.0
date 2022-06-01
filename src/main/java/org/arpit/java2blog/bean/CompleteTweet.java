package org.arpit.java2blog.bean;


import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class CompleteTweet implements Serializable {
	
	private static final long serialVersionUID = -2675337757219757372L;
	
	private Tweet tweet;
	private List<Tweet> replies;
	private List<Tweet> retweets;

	public CompleteTweet() {
	}

	public CompleteTweet(Tweet tweet, List<Tweet> replies, List<Tweet> retweets) {
		super();
		this.tweet = tweet;
		this.replies = replies;
		this.retweets = retweets;
	}

	public Tweet getTweet() {
		return tweet;
	}

	public void setTweet(Tweet tweet) {
		this.tweet = tweet;
	}

	public List<Tweet> getReplies() {
		return replies;
	}

	public void setReplies(List<Tweet> replies) {
		this.replies = replies;
	}
	
	public List<Tweet> getRetweets() {
		return retweets;
	}

	public void setRetweets(List<Tweet> retweets) {
		this.retweets = retweets;
	}

}