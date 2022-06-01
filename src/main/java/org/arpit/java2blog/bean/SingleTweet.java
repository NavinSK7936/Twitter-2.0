package org.arpit.java2blog.bean;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class SingleTweet implements Serializable {
	
	private static final long serialVersionUID = 5502592094817994080L;
	
    private String user_name;
    private String mention_name;
    private Tweet tweet;
	
    public SingleTweet() {
		super();
	}

    public SingleTweet(String user_name, String mention_name, Tweet tweet) {
        this.user_name = user_name;
        this.mention_name = mention_name;
        this.tweet = tweet;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getMention_name() {
        return mention_name;
    }

    public void setMention_name(String mention_name) {
        this.mention_name = mention_name;
    }

    public Tweet getTweet() {
        return tweet;
    }

    public void setTweet(Tweet tweet) {
        this.tweet = tweet;
    }
    

}