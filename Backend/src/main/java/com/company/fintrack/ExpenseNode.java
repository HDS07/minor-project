import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

public class ExpenseNode {
    private String userId;
    private Date date;
    private String category;
    private String subcategory;
    private double amount;
    private Date timestamp;
    private ExpenseNode next;

    public ExpenseNode(String userId, Date date, String category, String subcategory, double amount, Date timestamp) {
        this.userId = userId;
        this.date = date;
        this.category = category;
        this.subcategory = subcategory;
        this.amount = amount;
        this.timestamp = timestamp;
        this.next = null;
    }

    public static List<ExpenseNode> createExpenseNodesFromJson(String expensesJson) {
        List<ExpenseNode> expenses = new LinkedList<>();
        expensesJson = expensesJson.substring(1, expensesJson.length() - 1); // Remove the surrounding brackets
        String[] expenseArray = expensesJson.split("\\],\\[");

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

        for (String expenseStr : expenseArray) {
            expenseStr = expenseStr.replace("[", "").replace("]", ""); // Remove the surrounding brackets
            String[] fields = expenseStr.split(",");
            String userId = fields[0].trim().replace("\"", "");
            Date date = null;
            Date timestamp = null;
            try {
                date = dateFormat.parse(fields[1].trim().replace("\"", ""));
                timestamp = dateFormat.parse(fields[5].trim().replace("\"", ""));
            } catch (ParseException e) {
                e.printStackTrace();
            }
            String category = fields[2].trim().replace("\"", "");
            String subcategory = fields[3].trim().replace("\"", "");
            double amount = Double.parseDouble(fields[4].trim());

            ExpenseNode expense = new ExpenseNode(userId, date, category, subcategory, amount, timestamp);
            expenses.add(expense);
        }

        return expenses;
    }

    public static void main(String[] args) {
        if (args.length < 2 || args[0].trim().isEmpty() || args[1].trim().isEmpty()) {
            System.err.println("User ID or expenses argument is missing or empty.");
            System.exit(1);
        }

        String userId = args[0].trim();
        String expensesJson = args[1].trim();

        System.out.println("Processing expenses for User ID: " + userId);
        List<ExpenseNode> expenses = createExpenseNodesFromJson(expensesJson);

        if (expenses.isEmpty()) {
            System.out.println("No expenses found for User ID: " + userId);
        } else {
            System.out.println("Expenses processed successfully:");
            expenses.forEach(expense -> System.out.println(expense));
        }
    }

    @Override
    public String toString() {
        return "ExpenseNode{" +
                "userId='" + userId + '\'' +
                ", date=" + date +
                ", category='" + category + '\'' +
                ", subcategory='" + subcategory + '\'' +
                ", amount=" + amount +
                ", timestamp=" + timestamp +
                '}';
    }
}
