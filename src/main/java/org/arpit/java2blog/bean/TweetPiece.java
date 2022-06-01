package org.arpit.java2blog.bean;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class TweetPiece implements Serializable {

	private static final long serialVersionUID = 999436903829146221L;
    
    // VALUES => NONE, QUOTED, RETWEET, REPLY
    private String type;
    private TweetBox parent, child;
    
    public TweetPiece(String type, TweetBox parent, TweetBox child) {
        this.type = type;
        this.parent = parent;
        this.child = child;
    }

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public TweetBox getParent() {
        return parent;
    }
    public void setParent(TweetBox parent) {
        this.parent = parent;
    }
    public TweetBox getChild() {
        return child;
    }
    public void setChild(TweetBox child) {
        this.child = child;
    }
    
}
