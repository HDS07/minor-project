package com.company.fintrack;

import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoClient;
import com.mongodb.client.model.Filters;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ExpenseNode {
    private static final Logger logger = LoggerFactory.getLogger(ExpenseNode.class);

    private ObjectId userId;
    private Date date;
    private String category;
    private String subcategory;
    private double amount;
    private Date timestamp;
    private ExpenseNode next;

    public ExpenseNode(ObjectId userId, Date date, String category, String subcategory, double amount, Date timestamp) {
        this.userId = userId;
        this.date = date;
        this.category = category;
        this.subcategory = subcategory;
        this.amount = amount;
        this.timestamp = timestamp;
        this.next = null;
    }

    public static List<ExpenseNode> fetchExpensesByUserId(String userId) {
        List<ExpenseNode> expenses = new ArrayList<>();

        // MongoDB connection setup
        String mongoUri = System.getenv("MONGODB_URI");
        String dbName = System.getenv("DB_NAME");

        if (mongoUri == null || dbName == null) {
            logger.error("Environment variables MONGODB_URI or DB_NAME are not set.");
            System.exit(1);
        }

        try (MongoClient mongoClient = MongoClients.create(mongoUri)) {
            MongoDatabase database = mongoClient.getDatabase(dbName);
            MongoCollection<Document> collection = database.getCollection("expenses");

            // Validate and convert userId
            Bson filter;
            if (ObjectId.isValid(userId)) {
                filter = Filters.eq("userId", new ObjectId(userId.trim()));
            } else {
                filter = Filters.eq("userId", userId.trim());
            }

            logger.info("Running query with filter: {}", filter);
            for (Document doc : collection.find(filter)) {
                expenses.add(mapDocumentToExpenseNode(doc));
            }

            if (expenses.isEmpty()) {
                logger.warn("No expenses found for User ID: {}", userId);
            }
        } catch (IllegalArgumentException e) {
            logger.error("Invalid User ID format: {}", userId, e);
        } catch (Exception e) {
            logger.error("Error fetching expenses", e);
        }
        return expenses;
    }

    private static ExpenseNode mapDocumentToExpenseNode(Document doc) {
        return new ExpenseNode(
                doc.getObjectId("userId"),
                doc.getDate("date"),
                doc.getString("category"),
                doc.getString("subcategory"),
                doc.getDouble("amount"),
                doc.getDate("createdAt")
        );
    }

    public static void main(String[] args) {
        if (args.length < 1 || args[0].trim().isEmpty()) {
            logger.error("User ID argument is missing or empty.");
            System.exit(1);
        }

        String userId = args[0].trim();

        if (!ObjectId.isValid(userId) && userId.isEmpty()) {
            logger.error("Invalid User ID format: {}", userId);
            System.exit(1);
        }

        logger.info("Fetching expenses for User ID: {}", userId);
        List<ExpenseNode> expenses = fetchExpensesByUserId(userId);

        if (expenses.isEmpty()) {
            logger.info("No expenses found for User ID: {}", userId);
        } else {
            logger.info("Expenses fetched successfully:");
            expenses.forEach(expense -> logger.info(expense.toString()));
        }
    }

    @Override
    public String toString() {
        return "ExpenseNode{" +
                "userId=" + userId +
                ", date=" + date +
                ", category='" + category + '\'' +
                ", subcategory='" + subcategory + '\'' +
                ", amount=" + amount +
                ", timestamp=" + timestamp +
                '}';
    }
}
