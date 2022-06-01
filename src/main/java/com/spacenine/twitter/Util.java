package com.spacenine.twitter;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Util {
    
    public static int getMentionId(String line) {
		// String  = "${{00099912}}";
        String pattern = "\\$\\{\\{([0-9]+)\\}\\}";
        
        // Create a Pattern object
        Matcher m = Pattern.compile(pattern).matcher(line);
        
        if (m.find()) {
            m.group(0);
            return Integer.parseInt(m.group(1));
        }
		return -1;
	}
}
