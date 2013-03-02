package com.test.PHETBud;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.os.Environment;

public class PhetbudDatabaseManagement extends CordovaPlugin {
	
	private static String DB_NAME = "PHETBudDB.db";
    private static String DB_PATH = "/data/data/com.test.PHETBud/app_database/";
    public String filepath = "";
    
	@Override
	public boolean execute(String action, String args, final CallbackContext callbackContext) throws JSONException {
		filepath = args;
		filepath = filepath.replace("file://", "");
		filepath = filepath.replace('"', ' ');
		filepath = filepath.trim();
		filepath = filepath + "/";
		
	    if ("import".equals(action)) {
	        //final long duration = args.getLong(0);
	        cordova.getThreadPool().execute(new Runnable() {
	            public void run() {
	            	try {
	            		copyfile(filepath + DB_NAME, DB_PATH + DB_NAME);
	            		callbackContext.success(); // Thread-safe.
	            	} catch (FileNotFoundException fex) {
	            		callbackContext.error("file not found");
	            	}
	                
	                
	            }
	        });
	        return true;
	    }
	    
	    if ("export".equals(action)) {
	        //final long duration = args.getLong(0);
	        cordova.getThreadPool().execute(new Runnable() {
	            public void run() {
	            	try {
	            		copyfile(DB_PATH + DB_NAME, filepath + DB_NAME);
		                callbackContext.success(); // Thread-safe.
	            	} catch (FileNotFoundException fex) {
	            		callbackContext.error("file not found");
	            	}
	            	
	            }
	        });
	        return true;
	    }
	    return false;
	}
	
	public boolean checkDataBase(String srFile) {
	    File dbFile = new File(srFile);
	    return dbFile.exists();
	}

	public void copyfile(String srFile, String dtFile)
			throws FileNotFoundException {

		if (checkDataBase(srFile)) {
			InputStream myInput = new FileInputStream(srFile);

			// Path to the just created empty db
			String outFileName0 = Environment.getExternalStorageDirectory().getAbsolutePath();
			
			
			String outFileName = dtFile;

			// Open the empty db as the output stream
			OutputStream myOutput;
			try {
				myOutput = new FileOutputStream(outFileName);
				// transfer bytes from the inputfile to the outputfile
				byte[] buffer = new byte[1024];
				int length;
				while ((length = myInput.read(buffer)) > 0) {
					myOutput.write(buffer, 0, length);
				}
				// Close the streams
				myOutput.flush();
				myOutput.close();
				myInput.close();
			} catch (FileNotFoundException e) {
				// TODO Auto-generated catch block
				throw e;
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}
	}
}
