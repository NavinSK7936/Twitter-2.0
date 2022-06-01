package org.arpit.java2blog.bean;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class TweetBox implements Serializable {
    
	private static final long serialVersionUID = 156436903829146221L;

    private TwitterUser user;
    private Tweet tweet;

    public TweetBox(TwitterUser user, Tweet tweet) {
        this.user = user;
        this.tweet = tweet;
    }

    public TwitterUser getUser() {
        return user;
    }
    public void setUser(TwitterUser user) {
        this.user = user;
    }
    public Tweet getTweet() {
        return tweet;
    }
    public void setTweet(Tweet tweet) {
        this.tweet = tweet;
    }

    
}
