package net.codejava;

import java.sql.Connection;
import java.sql.DriverManager;

public class index {
	public static void main(String[] args) {
		String url ="jdbc:mysql://localhost:3306/financeu";
		String username = "root";
		String password = "password"; // modify later 

		try {
			Collection connection = DriverManager.getConnection(url, username, password);
			system.out.println("Connected to the database");
		} catch (SQLException e) {
			system.out.println( "oops, error! ");
			e.printStackTrace();
		}
		
	}
}
