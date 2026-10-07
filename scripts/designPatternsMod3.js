 

const BEHAVIORAL_PATTERNS = {
  id: "behavioral-patterns",
  topicNumber: 3,
  title: "3. Behavioral Patterns",
  description: "Algorithms, communication, and assignment of responsibilities between objects: Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, and Visitor.",
  subtopics: [
    {
      id: "chain-of-responsibility",
      subtopicNumber: "3.1",
      title: "Chain of Responsibility Pattern",
      subtitle: "Passes requests along a chain of handlers; upon receiving a request, each handler decides either to process it or pass it to the next handler.",
      readingTime: "7 min read",
      difficulty: "Foundational",
      accent: "#38bdf8",
      keyTakeaways: [
        "Decouples senders of a request from its receivers by giving multiple objects a chance to handle the request.",
        "Handlers are chained sequentially; a handler can short-circuit the pipeline (e.g., rejecting unauthorized requests) or decorate and forward it.",
        "Standard foundation for Servlet Filter chains, Express.js middleware, Spring Security interceptors, and ATM cash dispensing logic."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                  CHAIN OF RESPONSIBILITY UML CLASS MODEL                |
+-------------------------------------------------------------------------+
+------------------+                   +----------------------------------+
|      Client      |   sends ---->     |          <<abstract>>            |
+------------------+                   |         Handler (Base)           |
                                       +----------------------------------+
                                       | - next: Handler                  |
                                       | + setNext(h: Handler): Handler   |
                                       | + handle(req: Request): boolean  |
                                       +-----------------^----------------+
                                                         |
                   +-------------------+-----------------+-------------------+
                   |                                                         |
         +---------+--------+                                      +---------+--------+
         | AuthValidationHdl|   --- next: RateLimitHdl --->        | SanitizeInputHdl |
         +------------------+                                      +------------------+
         | + handle(): bool |                                      | + handle(): bool |
         +------------------+                                      +------------------+`,
      blockNodes: [
        { x: 50, y: 120, w: 200, h: 120, stereotype: 'client', title: 'HttpRequestClient', stroke: '#38bdf8', lines: ['Client layer', 'Dispatches request'], tag: 'Client' },
        { x: 340, y: 100, w: 260, h: 150, stereotype: 'abstract', title: 'MiddlewareHandler', stroke: '#10b981', lines: ['- next: MiddlewareHandler', '+ setNext(h): this', '+ handle(req): boolean'], tag: 'BaseHandler' },
        { x: 120, y: 310, w: 230, h: 130, stereotype: 'concrete', title: 'JwtAuthHandler', stroke: '#38bdf8', lines: ['Verify JWT signatures', 'Drop 401 on expired token'], tag: 'Handler 1' },
        { x: 400, y: 310, w: 230, h: 130, stereotype: 'concrete', title: 'RateLimiterHandler', stroke: '#f59e0b', lines: ['Token bucket check', 'Drop 429 on abuse'], tag: 'Handler 2' },
        { x: 680, y: 310, w: 230, h: 130, stereotype: 'concrete', title: 'SanitizerHandler', stroke: '#a855f7', lines: ['Escape SQL / XSS tags', 'Forward to Controller'], tag: 'Handler 3' }
      ],
      blockConns: [
        { d: 'M 250 170 L 340 170', lx: 295, ly: 155, label: 'invokes' },
        { d: 'M 235 310 L 380 250', lx: 300, ly: 275, label: 'extends' },
        { d: 'M 515 310 L 490 250', lx: 510, ly: 275, label: 'extends' },
        { d: 'M 795 310 L 600 250', lx: 710, ly: 275, label: 'extends' },
        { d: 'M 350 375 L 400 375', lx: 375, ly: 360, label: 'next' },
        { d: 'M 630 375 L 680 375', lx: 655, ly: 360, label: 'next' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'HTTP Request Arrives', stroke: '#38bdf8', lines: ['Request hits server entrypoint', 'Passes to JwtAuthHandler', 'Agnostic to subsequent chain'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Authentication Pass', stroke: '#10b981', lines: ['JWT validated successfully', 'Injects UserContext to request', 'Calls next.handle(request)'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'Rate Limit Inspection', stroke: '#f59e0b', lines: ['Checks Redis Token Bucket', 'Current rate: 45/100 RPS', 'Calls next.handle(request)'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Input Sanitization', stroke: '#a855f7', lines: ['Cleans body HTML tags', 'Reaches business Controller', 'Pipeline returns HTTP 200'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'valid JWT' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'under limit' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'sanitize' }
      ],
      sections: [
        {
          heading: "Dynamic Request Pipelines and Interceptor Decoupling",
          body: "When processing incoming requests, hardcoding authorization checks, rate-limiting rules, caching, and input sanitization directly into a controller creates monolithic code that violates the Single Responsibility Principle. The Chain of Responsibility pattern allows you to compose standalone handler units into dynamic linear pipelines.",
          bullets: [
            "Single Responsibility Principle: Each handler class does one thing (e.g. rate limiting or authentication).",
            "Open/Closed Principle: You can inject new inspection or filtering handlers into the pipeline without modifying existing handlers.",
            "Short-Circuit Capability: Handlers can abort execution early if validation conditions fail."
          ],
          codeSnippet: {
            title: "Production Request Middleware Chain in Java 21",
            code: `public record HttpRequest(String token, String ipAddress, String body) {}

public abstract class RequestHandler {
    private RequestHandler next;

    public RequestHandler linkWith(RequestHandler next) {
        this.next = next;
        return next;
    }

    public boolean handle(HttpRequest request) {
        if (next == null) return true;
        return next.handle(request);
    }
}

public class AuthHandler extends RequestHandler {
    @Override public boolean handle(HttpRequest request) {
        if (!"VALID_JWT_TOKEN".equals(request.token())) {
            System.out.println("401 Unauthorized: Invalid token");
            return false; // Short-circuit
        }
        return super.handle(request);
    }
}

public class RateLimitHandler extends RequestHandler {
    @Override public boolean handle(HttpRequest request) {
        if ("192.168.1.100".equals(request.ipAddress())) {
            System.out.println("429 Too Many Requests: Rate limit exceeded");
            return false; // Short-circuit
        }
        return super.handle(request);
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/chain-of-responsibility-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Chain of Responsibility",
          pros: "Decouples senders from receivers; high runtime composability; easy to reorder filters.",
          cons: "A request can reach the end of the chain unhandled without notification if not configured carefully.",
          bestFor: "HTTP request filters, event validation pipelines, GUI event bubbling."
        },
        {
          option: "Direct Imperative Conditionals",
          pros: "Straightforward linear procedural flow; very easy to read for 1-2 static checks.",
          cons: "Tightly couples validation rules; impossible to dynamically reorder or skip steps via config.",
          bestFor: "Simple scripts with zero dynamic filtering requirements."
        }
      ],
      interviewTip: "In interviews, cite `javax.servlet.FilterChain` or Spring `HandlerInterceptor` as real-world examples of Chain of Responsibility. Point out that unlike Decorator (which wraps an object to augment behavior and returns results back up), Chain of Responsibility can terminate execution at any link without invoking the rest of the chain."
    },
    {
      id: "command",
      subtopicNumber: "3.2",
      title: "Command Pattern",
      subtitle: "Encapsulates a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.",
      readingTime: "8 min read",
      difficulty: "Foundational",
      accent: "#a855f7",
      keyTakeaways: [
        "Turns a business operation into a standalone first-class object containing all necessary parameters and receiver references.",
        "Enables deferred execution, asynchronous task queues, command scheduling, transaction replay logging, and multi-level Undo/Redo stacks.",
        "Underpins CQRS architectures, database write-ahead logging (WAL), GUI menu actions, and macro recording engines."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                          COMMAND UML CLASS MODEL                        |
+-------------------------------------------------------------------------+
   +------------------+                   +-----------------------------+
   |  Invoker (UI)    |  holds ---->      |        <<interface>>        |
   +------------------+                   |           Command           |
   | - onCommand: Cmd |                   +-----------------------------+
   | + click(): void  |                   | + execute(): void           |
   +------------------+                   | + undo(): void              |
                                          +--------------^--------------+
                                                         |
                                          +--------------+--------------+
                                          |        ConcreteCommand      |
                                          +-----------------------------+
                                          | - receiver: Database        |
                                          | - backupState: Snapshot     |
                                          | + execute(): receiver.op()  |
                                          | + undo(): receiver.restore()|
                                          +-----------------------------+`,
      blockNodes: [
        { x: 50, y: 120, w: 220, h: 140, stereotype: 'invoker', title: 'CommandInvoker', stroke: '#a855f7', lines: ['- history: Deque<Command>', '+ executeCommand(cmd)', '+ undoLast()'], tag: 'Invoker' },
        { x: 380, y: 100, w: 250, h: 140, stereotype: 'interface', title: 'Command', stroke: '#10b981', lines: ['+ execute(): void', '+ undo(): void'], tag: 'Command Interface' },
        { x: 380, y: 310, w: 250, h: 140, stereotype: 'concrete', title: 'InsertRowCommand', stroke: '#38bdf8', lines: ['- db: DatabaseReceiver', '- rowId: UUID', '+ execute(): db.insert()', '+ undo(): db.delete()'], tag: 'ConcreteCommand' },
        { x: 740, y: 200, w: 220, h: 140, stereotype: 'receiver', title: 'Database (Receiver)', stroke: '#f59e0b', lines: ['+ insertRow(data)', '+ deleteRow(id)'], tag: 'Receiver' }
      ],
      blockConns: [
        { d: 'M 270 170 L 380 170', lx: 325, ly: 155, label: 'invokes' },
        { d: 'M 505 310 L 505 240', lx: 505, ly: 275, label: 'implements' },
        { d: 'M 630 380 L 740 280', lx: 690, ly: 340, label: 'operates on' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'Command Construction', stroke: '#a855f7', lines: ['User edits bank balance', 'Transfers $500', 'TransferFundsCommand created'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Invoker Queue & Execute', stroke: '#10b981', lines: ['Pushed to transactional queue', 'invoker.execute() called', 'cmd.execute() alters state'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'History Stack Push', stroke: '#38bdf8', lines: ['Pushed to in-memory Undo stack', 'Preserves compensating snapshot', 'Ready for rollback'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Undo Rollback', stroke: '#ef4444', lines: ['User clicks Undo button', 'invoker.undo() pops command', 'cmd.undo() reverses balance'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'enqueue' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'snapshot' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'undo' }
      ],
      sections: [
        {
          heading: "Reifying Invocations into First-Class Objects",
          body: "Direct method invocations (`account.deposit(500)`) tie the call site directly to execution time, precluding delayed scheduling, queuing, or rollback. By turning the request into an independent Command object, you can serialize commands to disk, ship them across Kafka to remote workers, or maintain an undo buffer.",
          bullets: [
            "Single Responsibility Principle: Decouples classes that invoke operations from classes that know how to execute them.",
            "Open/Closed Principle: Introduce new commands into your system without altering existing invoker or receiver code.",
            "Enables CQRS (Command Query Responsibility Segregation): Clean separation of write commands from read queries."
          ],
          codeSnippet: {
            title: "Undoable Bank Account Command Architecture in Java 21",
            code: `public interface Command {
    void execute();
    void undo();
}

public class BankAccount {
    private int balance = 0;
    public void deposit(int amount) { balance += amount; }
    public void withdraw(int amount) { balance -= amount; }
    public int getBalance() { return balance; }
}

public class DepositCommand implements Command {
    private final BankAccount account;
    private final int amount;

    public DepositCommand(BankAccount account, int amount) {
        this.account = account;
        this.amount = amount;
    }

    @Override public void execute() { account.deposit(amount); }
    @Override public void undo() { account.withdraw(amount); }
}

public class TransactionManager {
    private final Deque<Command> undoStack = new ArrayDeque<>();

    public void executeCommand(Command cmd) {
        cmd.execute();
        undoStack.push(cmd);
    }

    public void undoLast() {
        if (!undoStack.isEmpty()) {
            Command cmd = undoStack.pop();
            cmd.undo();
        }
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/command-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Command Pattern",
          pros: "Enables multi-level undo, asynchronous task queues, transaction replay, and decoupling.",
          cons: "Creates dozens of individual command classes for every minor operation in the system.",
          bestFor: "Text editors (undo/redo), CQRS distributed architectures, job schedulers, transactional sagas."
        },
        {
          option: "Direct Method Invocations",
          pros: "Immediate execution, minimal classes, direct stack traces.",
          cons: "Cannot defer execution; impossible to implement undo without complex ad-hoc state tracking.",
          bestFor: "Simple read-only lookups and stateless calculation services."
        }
      ],
      interviewTip: "In distributed architecture interviews, connect the Command pattern directly to Command Query Responsibility Segregation (CQRS) and the Outbox pattern. Mention that in modern event-driven architectures, commands are dispatched to event brokers for guaranteed asynchronous execution."
    },
    {
      id: "interpreter",
      subtopicNumber: "3.3",
      title: "Interpreter Pattern",
      subtitle: "Given a language, defines a representation for its grammar along with an interpreter that uses the representation to interpret sentences in the language.",
      readingTime: "7 min read",
      difficulty: "Advanced",
      accent: "#f59e0b",
      keyTakeaways: [
        "Defines an Abstract Syntax Tree (AST) where terminal and non-terminal grammar rules are represented by classes.",
        "Allows evaluating domain-specific languages (DSLs), mathematical formulas, SQL-like query filters, or JSON path expressions.",
        "For complex languages, dedicated parser generators (ANTLR, Lex/Yacc) are preferred over manual GoF Interpreter class trees."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                        INTERPRETER UML CLASS MODEL                      |
+-------------------------------------------------------------------------+
                       +-----------------------------+
                       |        <<interface>>        |
                       |         Expression          |
                       +-----------------------------+
                       | + interpret(ctx): boolean   |
                       +--------------^--------------+
                                      |
              +-----------------------+-----------------------+
              |                                               |
+-------------+---------------+               +---------------+-------------+
|     TerminalExpression      |               |     OrExpression (Non-term) |
+-----------------------------+               +-----------------------------+
| - literal: String           |               | - expr1: Expression         |
| + interpret(ctx): match     |               | - expr2: Expression         |
+-----------------------------+               | + interpret(ctx): e1 || e2  |
                                              +-----------------------------+`,
      blockNodes: [
        { x: 320, y: 100, w: 260, h: 130, stereotype: 'interface', title: 'BooleanExpression', stroke: '#f59e0b', lines: ['+ interpret(ctx: Context): boolean'], tag: 'AbstractExpression' },
        { x: 100, y: 290, w: 250, h: 140, stereotype: 'terminal', title: 'TerminalRule', stroke: '#10b981', lines: ['- literal: String', '+ interpret(ctx): ctx.contains(literal)'], tag: 'Terminal' },
        { x: 550, y: 290, w: 270, h: 150, stereotype: 'non-terminal', title: 'AndExpression', stroke: '#38bdf8', lines: ['- left: Expression', '- right: Expression', '+ interpret(ctx): left.eval() &amp;&amp; right.eval()'], tag: 'Non-Terminal' }
      ],
      blockConns: [
        { d: 'M 225 290 L 370 230', lx: 280, ly: 255, label: 'implements' },
        { d: 'M 685 290 L 530 230', lx: 635, ly: 255, label: 'implements' },
        { d: 'M 820 365 C 870 365 870 160 580 160', lx: 870, ly: 260, label: 'recursively evaluates' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'Query String Parsing', stroke: '#f59e0b', lines: ['Rule: "(VIP OR Gold) AND Active"', 'Tokenizer splits into tokens', 'Parser builds AST tree'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'AST Assembly', stroke: '#38bdf8', lines: ['Root: AndExpression', 'Left child: OrExpression', 'Leaves: TerminalExpressions'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'Context Evaluation', stroke: '#10b981', lines: ['Context contains user tags', 'Evaluates leaf node matches', 'Leaves return true/false'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Final Resolution', stroke: '#a855f7', lines: ['Root And evaluates subtrees', 'Short-circuits where possible', 'Returns final Boolean result'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'build AST' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'evaluate' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'resolve' }
      ],
      sections: [
        {
          heading: "Evaluating Domain-Specific Rules via Recursive AST Trees",
          body: "When building business rule engines (e.g. 'Discount eligible if order total > $100 AND user is VIP'), hardcoding rules into procedural code requires redeploying software whenever business analysts change marketing rules. The Interpreter pattern maps grammar production rules into an object-oriented composite tree evaluated against a context.",
          bullets: [
            "Easy Grammar Extensibility: Adding a new operator (e.g. `XOR` or `NOT`) simply requires introducing a new Expression subclass.",
            "Decoupled Context: The evaluation context holds runtime variables without coupling to AST grammar structure.",
            "Performance Trade-off: Deep AST trees incur method recursion overhead; for high-frequency trading rules, compiling to bytecode or using ANTLR is superior."
          ],
          codeSnippet: {
            title: "Rule Engine Boolean Interpreter in Java 21",
            code: `public interface Expression {
    boolean interpret(Set<String> context);
}

public record TerminalExpression(String data) implements Expression {
    @Override public boolean interpret(Set<String> context) {
        return context.contains(data);
    }
}

public record OrExpression(Expression expr1, Expression expr2) implements Expression {
    @Override public boolean interpret(Set<String> context) {
        return expr1.interpret(context) || expr2.interpret(context);
    }
}

public record AndExpression(Expression expr1, Expression expr2) implements Expression {
    @Override public boolean interpret(Set<String> context) {
        return expr1.interpret(context) && expr2.interpret(context);
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/interpreter-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Interpreter Pattern",
          pros: "Simple to implement for small Domain Specific Languages (DSLs); flexible rule modifications.",
          cons: "Not scalable for complex grammars; creates massive class trees; inefficient compared to bytecode compilers.",
          bestFor: "Simple SQL query filter parsers, regex evaluation, calculation rule engines."
        },
        {
          option: "Dedicated Parser Generator (ANTLR / JavaCC)",
          pros: "Handles complex BNF grammars, generates efficient ASTs, industrial-grade error reporting.",
          cons: "Steep learning curve, additional build tooling dependencies.",
          bestFor: "Full programming language compilers and complex data query dialects."
        }
      ],
      interviewTip: "In interviews, explicitly state the limitation of the GoF Interpreter pattern: it is only suitable for simple grammars. For anything complex, recommend parser generator tools like ANTLR or using lightweight scripting engines like SpEL (Spring Expression Language)."
    },
    {
      id: "iterator",
      subtopicNumber: "3.4",
      title: "Iterator Pattern",
      subtitle: "Provides a way to access the elements of an aggregate object sequentially without exposing its underlying representation.",
      readingTime: "6 min read",
      difficulty: "Foundational",
      accent: "#10b981",
      keyTakeaways: [
        "Encapsulates collection traversal algorithms (Depth-First Search, Breadth-First Search, reverse order) away from the collection itself.",
        "Allows multiple concurrent iterations over the same collection without modifying collection internal state.",
        "The standard underpinning of Java's `java.util.Iterator`, `Iterable`, and the enhanced `for-each` loop."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                         ITERATOR UML CLASS MODEL                        |
+-------------------------------------------------------------------------+
+--------------------------+               +-----------------------------+
|      <<interface>>       |               |        <<interface>>        |
|      IterableList<T>     |  creates ---> |         Iterator<T>         |
+--------------------------+               +-----------------------------+
| + createIterator(): Iter |               | + hasNext(): boolean        |
+------------^-------------+               | + next(): T                 |
             |                             +--------------^--------------+
+------------+-------------+                              |
|     CustomArrayList      |               +--------------+--------------+
+--------------------------+               |     CustomArrayIterator     |
| - items: Object[]        |               +-----------------------------+
| + createIterator(): Iter |               | - cursor: int = 0           |
+--------------------------+               | + next(): items[cursor++]   |
                                           +-----------------------------+`,
      blockNodes: [
        { x: 50, y: 110, w: 250, h: 140, stereotype: 'iterable', title: 'IterableAggregate<T>', stroke: '#10b981', lines: ['+ iterator(): Iterator<T>'], tag: 'Aggregate' },
        { x: 50, y: 310, w: 250, h: 130, stereotype: 'concrete-agg', title: 'BinaryTree<T>', stroke: '#38bdf8', lines: ['- root: Node<T>', '+ iterator(): InOrderTreeIterator'], tag: 'ConcreteAggregate' },
        { x: 550, y: 110, w: 250, h: 140, stereotype: 'iterator', title: 'Iterator<T>', stroke: '#f59e0b', lines: ['+ hasNext(): boolean', '+ next(): T'], tag: 'Iterator' },
        { x: 550, y: 310, w: 250, h: 130, stereotype: 'concrete-iter', title: 'InOrderTreeIterator<T>', stroke: '#a855f7', lines: ['- stack: Deque<Node<T>>', '+ next(): yields sorted node'], tag: 'ConcreteIterator' }
      ],
      blockConns: [
        { d: 'M 175 310 L 175 250', lx: 175, ly: 280, label: 'implements' },
        { d: 'M 300 170 L 550 170', lx: 425, ly: 155, label: 'creates' },
        { d: 'M 675 310 L 675 250', lx: 675, ly: 280, label: 'implements' },
        { d: 'M 300 375 L 550 375', lx: 425, ly: 360, label: 'traverses' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'Iterator Requested', stroke: '#10b981', lines: ['Client calls tree.iterator()', 'Tree yields fresh cursor object', 'Cursor initializes internal stack'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'hasNext() Check', stroke: '#f59e0b', lines: ['Verifies remaining nodes', 'Non-destructive query', 'Returns true if stack non-empty'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'next() Advance', stroke: '#38bdf8', lines: ['Pops current node from stack', 'Pushes right child subtree', 'Advances cursor position'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Iteration Completes', stroke: '#a855f7', lines: ['Cursor reaches end of tree', 'hasNext() returns false', 'Loop cleanly exits'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'initialize' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'check' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'yield' }
      ],
      sections: [
        {
          heading: "Uniform Traversal without Breaking Internal Encapsulation",
          body: "Exposing internal collection structures (arrays, binary tree nodes, skip lists) to client code exposes private pointers and breaks encapsulation. The Iterator pattern provides a standardized cursor interface, allowing developers to switch from an array list to a balanced AVL tree without changing any client traversal loops.",
          bullets: [
            "Single Responsibility Principle: Traversal algorithms are extracted away from the data structure classes into dedicated iterator classes.",
            "Open/Closed Principle: Introduce custom iterators (e.g., Breadth-First or Depth-First) without changing the data structure.",
            "Fail-Fast Semantics: Modern iterators detect concurrent modifications using version counters (`modCount`), throwing `ConcurrentModificationException`."
          ],
          codeSnippet: {
            title: "Custom In-Order Binary Tree Iterator in Java 21",
            code: `public record TreeNode<T>(T val, TreeNode<T> left, TreeNode<T> right) {}

public class InOrderTreeIterator<T> implements Iterator<T> {
    private final Deque<TreeNode<T>> stack = new ArrayDeque<>();

    public InOrderTreeIterator(TreeNode<T> root) {
        pushLeft(root);
    }

    private void pushLeft(TreeNode<T> node) {
        while (node != null) {
            stack.push(node);
            node = node.left();
        }
    }

    @Override
    public boolean hasNext() {
        return !stack.isEmpty();
    }

    @Override
    public T next() {
        if (!hasNext()) throw new NoSuchElementException();
        TreeNode<T> current = stack.pop();
        pushLeft(current.right());
        return current.val();
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/iterator-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Iterator Pattern",
          pros: "Hides data structure representation; supports multiple simultaneous traversals; clean unified API.",
          cons: "Overkill for simple arrays where indexed `for` loops are marginally faster and simpler.",
          bestFor: "Complex graphs, binary trees, paginated database cursor streams."
        },
        {
          option: "Direct Array/Index Access",
          pros: "Zero object allocation overhead; direct memory pointer access.",
          cons: "Tightly binds client to array indexing; fails for trees and linked graphs.",
          bestFor: "High-performance primitives arrays in numerical computing."
        }
      ],
      interviewTip: "In interviews, explain Java's Fail-Fast vs Fail-Safe iterators: Fail-Fast (e.g. `ArrayList.iterator()`) throws `ConcurrentModificationException` if the underlying list changes during iteration. Fail-Safe (e.g. `CopyOnWriteArrayList`) operates on a clone of the collection and never throws."
    },
    {
      id: "mediator",
      subtopicNumber: "3.5",
      title: "Mediator Pattern",
      subtitle: "Defines an object that encapsulates how a set of objects interact, preventing them from referring to each other explicitly.",
      readingTime: "7 min read",
      difficulty: "Intermediate",
      accent: "#38bdf8",
      keyTakeaways: [
        "Replaces many-to-many dependencies ($O(N^2)$ coupling) between colleagues with one-to-many dependencies ($O(N)$ coupling) via a central Mediator.",
        "Colleagues only know about the Mediator; they send notifications to it, and the Mediator orchestrates the reactions of other components.",
        "Underpins Air Traffic Control systems, chatroom message hubs, and complex UI dialog forms with interdependent form inputs."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                         MEDIATOR UML CLASS MODEL                        |
+-------------------------------------------------------------------------+
 [Without Mediator: Many-to-Many]            [With Mediator: Star Topology]
      (A) <--------> (B)                                  (A)
       ^ \\          / ^                                    ^
       |   \\      /   |                                    |
       |     \\  /     |                                    v
      (C) <--------> (D)                            (B) <-> [Mediator] <-> (C)
     (Complex Spagetti Links)                              ^
                                                           |
                                                           v
                                                          (D)`,
      blockNodes: [
        { x: 340, y: 100, w: 260, h: 140, stereotype: 'mediator', title: 'AirTrafficMediator', stroke: '#38bdf8', lines: ['+ notify(sender, event): void', '+ registerFlight(flight)'], tag: 'Mediator Interface' },
        { x: 100, y: 310, w: 220, h: 130, stereotype: 'colleague', title: 'BoeingFlight747', stroke: '#10b981', lines: ['- mediator: AirTrafficMediator', '+ requestLanding()'], tag: 'Colleague A' },
        { x: 360, y: 310, w: 220, h: 130, stereotype: 'colleague', title: 'AirbusFlightA320', stroke: '#f59e0b', lines: ['- mediator: AirTrafficMediator', '+ holdInHoldingPattern()'], tag: 'Colleague B' },
        { x: 620, y: 310, w: 220, h: 130, stereotype: 'colleague', title: 'AirportRunway', stroke: '#ef4444', lines: ['- mediator: AirTrafficMediator', '+ lockRunway() / free()'], tag: 'Colleague C' }
      ],
      blockConns: [
        { d: 'M 210 310 L 400 240', lx: 280, ly: 270, label: 'talks via' },
        { d: 'M 470 310 L 470 240', lx: 470, ly: 275, label: 'talks via' },
        { d: 'M 730 310 L 540 240', lx: 650, ly: 270, label: 'talks via' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'Landing Request', stroke: '#10b981', lines: ['Flight A requests landing', 'Calls mediator.notify("LAND")', 'Zero knowledge of Flight B'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Mediator Arbitration', stroke: '#38bdf8', lines: ['ATC checks runway state', 'Runway is currently occupied', 'Resolves scheduling priority'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'Flight B Hold Order', stroke: '#f59e0b', lines: ['Mediator orders Flight B to hold', 'Adjusts flight altitude', 'Guarantees separation safety'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Runway Clearance', stroke: '#ef4444', lines: ['Mediator clears runway', 'Signals Flight A to touch down', 'All colleagues stay decoupled'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'request' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'arbitrate' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'coordinate' }
      ],
      sections: [
        {
          heading: "Preventing Sprawling Spiderweb Dependencies",
          body: "When UI dialogs contain checkboxes that disable text inputs, which trigger validation errors, which change button colors, objects become tightly coupled in an $O(N^2)$ tangle. Changing one component breaks three others. The Mediator pattern extracts all communication logic into a centralized controller.",
          bullets: [
            "Single Responsibility Principle: Centralizes communication and orchestration logic between disparate objects into one dedicated class.",
            "Open/Closed Principle: You can introduce new colleagues into the system without changing existing colleagues.",
            "Risk of God Object: The mediator can easily devolve into an overly complex 'God Object' if not subdivided properly."
          ],
          codeSnippet: {
            title: "Chatroom Hub Mediator in Java 21",
            code: `public interface ChatMediator {
    void sendMessage(String message, User sender);
    void addUser(User user);
}

public abstract class User {
    protected final ChatMediator mediator;
    protected final String name;

    public User(ChatMediator mediator, String name) {
        this.mediator = mediator;
        this.name = name;
    }

    public abstract void send(String message);
    public abstract void receive(String message);
}

public class ChatRoomMediator implements ChatMediator {
    private final List<User> users = new ArrayList<>();

    @Override public void addUser(User user) { users.add(user); }

    @Override
    public void sendMessage(String message, User sender) {
        for (User u : users) {
            // Do not echo back to sender
            if (u != sender) u.receive(sender.name + ": " + message);
        }
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/mediator-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Mediator Pattern",
          pros: "Reduces coupling between multiple classes; centralizes complex relationships.",
          cons: "The mediator itself can evolve into an unmaintainable monolith over time.",
          bestFor: "Air traffic control, chatrooms, interconnected UI form wizard steps."
        },
        {
          option: "Direct Colleague References",
          pros: "Direct and simple when there are only 2 classes interacting.",
          cons: "Combinatorial spaghetti code as the number of interacting classes grows past 4.",
          bestFor: "Simple 1-to-1 relationships."
        }
      ],
      interviewTip: "Contrast Mediator with Observer: In Observer, communication flows dynamically from 1 Subject to many Observers in a publisher-subscriber model. In Mediator, communication flows multidirectionally between Colleagues through a centralized hub that encapsulates complex cross-cutting coordination logic."
    },
    {
      id: "memento",
      subtopicNumber: "3.6",
      title: "Memento Pattern",
      subtitle: "Captures and externalizes an object's internal state without violating encapsulation, allowing the object to be restored to this state later.",
      readingTime: "7 min read",
      difficulty: "Intermediate",
      accent: "#a855f7",
      keyTakeaways: [
        "Provides state snapshotting and restoration without exposing private fields or internal implementation details.",
        "The Caretaker (e.g. history manager) stores mementos but can never read or mutate their internal contents ('black box' token).",
        "Essential for database transaction savepoints, graphic editor history checkpoints, and text editor undo buffers."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                         MEMENTO UML CLASS MODEL                         |
+-------------------------------------------------------------------------+
+----------------------------+             +----------------------------+
|         Originator         |             |          Memento           |
+----------------------------+             +----------------------------+
| - state: String            | creates ->  | - state: String (private)  |
| + createMemento(): Memento |             | + getState(): String       |
| + restore(m: Memento): void|             +----------------------------+
+----------------------------+                           ^
                                                         | stores
                                           +-------------+--------------+
                                           |         Caretaker          |
                                           +----------------------------+
                                           | - history: Deque<Memento>  |
                                           | + save(): void             |
                                           | + undo(): void             |
                                           +----------------------------+`,
      blockNodes: [
        { x: 50, y: 120, w: 240, h: 140, stereotype: 'originator', title: 'TextEditor (Originator)', stroke: '#a855f7', lines: ['- content: StringBuilder', '+ save(): EditorMemento', '+ restore(m: Memento)'], tag: 'Originator' },
        { x: 370, y: 120, w: 250, h: 140, stereotype: 'memento', title: 'EditorMemento (Opaque)', stroke: '#10b981', lines: ['- state: String {private}', '- timestamp: Instant', 'Private constructor'], tag: 'Memento' },
        { x: 690, y: 120, w: 230, h: 140, stereotype: 'caretaker', title: 'HistoryManager (Caretaker)', stroke: '#38bdf8', lines: ['- snapshots: Deque<Memento>', '+ backup(editor)', '+ undo(editor)'], tag: 'Caretaker' }
      ],
      blockConns: [
        { d: 'M 290 190 L 370 190', lx: 330, ly: 175, label: 'creates' },
        { d: 'M 690 190 L 620 190', lx: 655, ly: 175, label: 'stores' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'State Mutates', stroke: '#a855f7', lines: ['User types "Hello World"', 'Originator internal state changes', 'Snapshot trigger fires'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Memento Creation', stroke: '#10b981', lines: ['Originator creates Memento', 'Copies private state buffer', 'Returns immutable memento'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'Caretaker Retention', stroke: '#38bdf8', lines: ['Caretaker pushes to stack', 'Caretaker cannot read content', 'Opaque state token'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'State Restoration', stroke: '#f59e0b', lines: ['User invokes Undo', 'Caretaker hands memento back', 'Originator restores state'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'snapshot' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'store' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'restore' }
      ],
      sections: [
        {
          heading: "Encapsulated State Restoration without Breaking Privacy",
          body: "Directly exposing an object's internal fields via public getters and setters to allow external classes to take backups breaks encapsulation. If the internal data structure changes from a String to a Rope or Tree, external backup classes break. Memento ensures that the Originator is the only class capable of reading and writing the snapshot data.",
          bullets: [
            "Preserves Encapsulation Boundaries: The internal state of the originator remains strictly private.",
            "Simplified Caretaker: The caretaker only stores and passes memento objects without knowing anything about their contents.",
            "Memory Consumption Caution: Storing frequent deep-state mementos can exhaust heap memory; consider delta/diff compression."
          ],
          codeSnippet: {
            title: "Type-Safe Memento Snapshot in Java 21",
            code: `// Originator
public class TextDocument {
    private String text = "";

    public void write(String words) { text += words; }
    public String getText() { return text; }

    // Creates Snapshot
    public Memento save() { return new Memento(this.text); }

    // Restores Snapshot
    public void restore(Memento memento) { this.text = memento.state(); }

    // The Memento (Immutable record)
    public record Memento(String state) {}
}

// Caretaker
public class DocumentHistory {
    private final Deque<TextDocument.Memento> history = new ArrayDeque<>();

    public void backup(TextDocument doc) {
        history.push(doc.save());
    }

    public void undo(TextDocument doc) {
        if (!history.isEmpty()) {
            doc.restore(history.pop());
        }
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/memento-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Memento Pattern",
          pros: "Protects encapsulation; allows clean restoration of historical states.",
          cons: "High memory footprint if snapshots are taken frequently on large objects.",
          bestFor: "Transaction savepoints, graphic design undo stacks, game save files."
        },
        {
          option: "Public Getters/Setters State Cloning",
          pros: "Simple to write quickly without dedicated memento classes.",
          cons: "Destroys encapsulation; leaks private internal state across the codebase.",
          bestFor: "Simple anemic DTO records with no private invariants."
        }
      ],
      interviewTip: "In interviews, explain how Memento combines with Command: A Command object can store a Memento of the Receiver's state right before executing `execute()`. When `undo()` is called, the Command passes the saved Memento back to the Receiver to revert it cleanly."
    },
    {
      id: "observer",
      subtopicNumber: "3.7",
      title: "Observer Pattern",
      subtitle: "Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.",
      readingTime: "8 min read",
      difficulty: "Foundational",
      accent: "#10b981",
      keyTakeaways: [
        "Defines a publisher-subscriber contract where Subject publishes state updates to an arbitrary number of registered Observers.",
        "Subject does not know the concrete class of any Observer, adhering strictly to the Open/Closed Principle.",
        "The bedrock of event-driven architectures, reactive programming (RxJava, Project Reactor), GUI button listeners, and message queues."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                         OBSERVER UML CLASS MODEL                        |
+-------------------------------------------------------------------------+
   +-----------------------------+               +-----------------------------+
   |        <<interface>>        |               |        <<interface>>        |
   |           Subject           |  notifies --> |           Observer          |
   +-----------------------------+               +-----------------------------+
   | + attach(o: Observer): void |               | + update(event): void       |
   | + detach(o: Observer): void |               +--------------^--------------+
   | + notifyObservers(): void   |                              |
   +--------------^--------------+               +--------------+--------------+
                  |                              |                             |
   +--------------+--------------+     +---------+----------+       +----------+---------+
   |         StockTicker         |     |   MobileAppDisplay |       |   EmailAlertSubscriber |
   +-----------------------------+     +--------------------+       +--------------------+
   | - price: BigDecimal         |     | + update(): render |       | + update(): send   |
   +-----------------------------+     +--------------------+       +--------------------+`,
      blockNodes: [
        { x: 50, y: 110, w: 260, h: 140, stereotype: 'subject', title: 'MarketSubject', stroke: '#10b981', lines: ['- observers: List<Observer>', '+ attach(o) / detach(o)', '+ notifyObservers(event)'], tag: 'Subject' },
        { x: 550, y: 110, w: 260, h: 140, stereotype: 'observer', title: 'Observer<T>', stroke: '#38bdf8', lines: ['+ onUpdate(event: T): void'], tag: 'Observer Interface' },
        { x: 420, y: 320, w: 220, h: 130, stereotype: 'concrete-obs', title: 'TradingBotObserver', stroke: '#f59e0b', lines: ['+ onUpdate(): evaluate RSI', '  -> trigger automated order'], tag: 'Concrete Obs A' },
        { x: 670, y: 320, w: 220, h: 130, stereotype: 'concrete-obs', title: 'PushNotifierObserver', stroke: '#ef4444', lines: ['+ onUpdate(): dispatch APNS', '  -> mobile push alert'], tag: 'Concrete Obs B' }
      ],
      blockConns: [
        { d: 'M 310 170 L 550 170', lx: 430, ly: 155, label: 'notifies' },
        { d: 'M 530 320 L 630 250', lx: 570, ly: 285, label: 'implements' },
        { d: 'M 780 320 L 710 250', lx: 755, ly: 285, label: 'implements' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'Price Change Event', stroke: '#10b981', lines: ['Stock price jumps to $195', 'StockTicker state mutates', 'Calls notifyObservers()'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Broadcast Iteration', stroke: '#38bdf8', lines: ['Iterates subscriber list', 'Calls observer.onUpdate()', 'Non-blocking notification'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'Algorithmic Bot', stroke: '#f59e0b', lines: ['Trading bot executes order', 'Buys 100 shares in 2ms', 'Independent processing'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Mobile Notification', stroke: '#ef4444', lines: ['Apple Push Notification sent', 'User phone vibrates', 'Subject completely decoupled'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'publish' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'dispatch' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'notify' }
      ],
      sections: [
        {
          heading: "Decoupled Event Broadcasting and Memory Leak Hazards",
          body: "When business state changes need to trigger updates across disparate services (e.g. user signup triggers welcome emails, analytics tracking, and fraud checks), coupling the signup service to all three modules creates an unmaintainable tangle. The Observer pattern allows subscribers to register and deregister dynamically.",
          bullets: [
            "Open/Closed Principle: Add new subscribers without modifying a single line of the publisher.",
            "Lapsed Listener Problem: Observers that fail to unregister can remain in the Subject's reference list forever, creating silent memory leaks.",
            "Push vs Pull Models: Push sends all event data directly in method parameters; Pull passes only a reference so the observer queries what it needs."
          ],
          codeSnippet: {
            title: "Thread-Safe Stock Market Publisher in Java 21",
            code: `public interface MarketObserver {
    void onPriceUpdate(String symbol, double price);
}

public class StockTicker {
    private final List<MarketObserver> observers = new CopyOnWriteArrayList<>();
    private final Map<String, Double> prices = new ConcurrentHashMap<>();

    public void subscribe(MarketObserver observer) {
        observers.add(observer);
    }

    public void unsubscribe(MarketObserver observer) {
        observers.remove(observer);
    }

    public void setPrice(String symbol, double price) {
        prices.put(symbol, price);
        for (MarketObserver observer : observers) {
            observer.onPriceUpdate(symbol, price);
        }
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/observer-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Observer Pattern",
          pros: "Loosely coupled publisher/subscriber; dynamic runtime subscription; clean Open/Closed design.",
          cons: "Subscribers are notified in random/unspecified order; potential memory leaks if not unsubscribed.",
          bestFor: "Event-driven systems, UI button event listeners, stock price updates, sensor networks."
        },
        {
          option: "Synchronous Polling",
          pros: "Very simple; client controls when to query for updates.",
          cons: "Wastes CPU cycles and network bandwidth checking for changes that haven't occurred.",
          bestFor: "Low-frequency batch jobs."
        }
      ],
      interviewTip: "In interviews, discuss the 'Lapsed Listener Problem' (memory leak caused by strong references from Subject to Observers preventing GC). Explain how using `WeakReference` or explicit lifecycle cleanup methods prevents this in long-running services."
    },
    {
      id: "state",
      subtopicNumber: "3.8",
      title: "State Pattern",
      subtitle: "Allows an object to alter its behavior when its internal state changes, appearing to change its class.",
      readingTime: "7 min read",
      difficulty: "Intermediate",
      accent: "#f59e0b",
      keyTakeaways: [
        "Eliminates gargantuan switch-case statements that check `if (state == PAID)` across dozens of class methods.",
        "Encapsulates state-specific behavior into independent State classes; state transitions are handled cleanly by delegating to new State instances.",
        "Underpins Finite State Machines (FSMs), order checkout lifecycles, TCP connection handling, and game character animations."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                           STATE UML CLASS MODEL                         |
+-------------------------------------------------------------------------+
   +-----------------------------+               +-----------------------------+
   |       OrderContext          |               |        <<interface>>        |
   |                             |  delegates -> |          OrderState         |
   +-----------------------------+               +-----------------------------+
   | - state: OrderState         |               | + pay(): void               |
   | + setState(s: OrderState)   |               | + ship(): void              |
   | + pay(): void               |               | + cancel(): void            |
   +-----------------------------+               +--------------^--------------+
                                                                |
                                 +------------------------------+------------------------------+
                                 |                                                             |
                   +-------------+---------------+                               +-------------+---------------+
                   |        CreatedState         |                               |          PaidState          |
                   +-----------------------------+                               +-----------------------------+
                   | + pay(): ctx.setState(Paid) |                               | + ship(): ctx.setState(Ship)|
                   | + ship(): throw Error       |                               | + cancel(): refund & cancel |
                   +-----------------------------+                               +-----------------------------+`,
      blockNodes: [
        { x: 50, y: 120, w: 250, h: 140, stereotype: 'context', title: 'OrderContext', stroke: '#f59e0b', lines: ['- currentState: OrderState', '+ setState(s)', '+ pay() / cancel()'], tag: 'Context' },
        { x: 550, y: 100, w: 260, h: 140, stereotype: 'interface', title: 'OrderState', stroke: '#10b981', lines: ['+ pay(ctx: OrderContext)', '+ ship(ctx: OrderContext)', '+ cancel(ctx: OrderContext)'], tag: 'State Interface' },
        { x: 400, y: 310, w: 230, h: 130, stereotype: 'concrete-state', title: 'CreatedState', stroke: '#38bdf8', lines: ['+ pay(): transition to Paid', '+ ship(): IllegalState!'], tag: 'State A' },
        { x: 670, y: 310, w: 230, h: 130, stereotype: 'concrete-state', title: 'PaidState', stroke: '#ef4444', lines: ['+ ship(): transition to Shipped', '+ cancel(): refund money'], tag: 'State B' }
      ],
      blockConns: [
        { d: 'M 300 180 L 550 160', lx: 425, ly: 155, label: 'delegates to' },
        { d: 'M 515 310 L 610 240', lx: 550, ly: 275, label: 'implements' },
        { d: 'M 785 310 L 730 240', lx: 765, ly: 275, label: 'implements' },
        { d: 'M 400 375 C 330 375 330 240 250 240', lx: 330, ly: 300, label: 'mutates context' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'Order Created', stroke: '#f59e0b', lines: ['Context starts in CreatedState', 'Client calls order.ship()', 'State throws IllegalStateException'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Payment Event', stroke: '#38bdf8', lines: ['Client calls order.pay()', 'CreatedState validates charge', 'Calls context.setState(PaidState)'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'State Swapped', stroke: '#10b981', lines: ['Context now behaves as Paid', 'Identical order.ship() now works', 'Zero giant switch statements'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Shipment Complete', stroke: '#a855f7', lines: ['PaidState transitions to Shipped', 'Canceling order is now forbidden', 'Clean finite state machine'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'pay()' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'transition' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'ship()' }
      ],
      sections: [
        {
          heading: "Eliminating Massive Switch-Case State Machines",
          body: "When an entity's behavior depends entirely on its lifecycle state, imperative code fills up with giant conditional statements: `switch(order.status) { case PENDING: ... case SHIPPED: ... }`. Every time a new state is added, developers must find and edit every switch statement. The State pattern extracts each state into an autonomous class.",
          bullets: [
            "Single Responsibility Principle: Organizes all behavior specific to a particular state into a single cohesive class.",
            "Open/Closed Principle: Introduce new states without modifying existing state classes or context methods.",
            "Type-Safe State Transitions: Impossible transitions (e.g., shipping an unpaid order) throw clear compile or runtime exceptions."
          ],
          codeSnippet: {
            title: "Order Lifecycle Finite State Machine in Java 21",
            code: `public interface OrderState {
    void pay(OrderContext ctx);
    void ship(OrderContext ctx);
}

public class OrderContext {
    private OrderState state = new CreatedState();

    public void setState(OrderState state) { this.state = state; }
    public void pay() { state.pay(this); }
    public void ship() { state.ship(this); }
}

public class CreatedState implements OrderState {
    @Override public void pay(OrderContext ctx) {
        System.out.println("Payment processed successfully.");
        ctx.setState(new PaidState());
    }

    @Override public void ship(OrderContext ctx) {
        throw new IllegalStateException("Cannot ship an unpaid order!");
    }
}

public class PaidState implements OrderState {
    @Override public void pay(OrderContext ctx) {
        throw new IllegalStateException("Order is already paid.");
    }

    @Override public void ship(OrderContext ctx) {
        System.out.println("Dispatched to warehouse for shipping.");
        ctx.setState(new ShippedState());
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/state-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "State Pattern",
          pros: "Eliminates duplicate switch statements; encapsulates state transitions; highly extensible.",
          cons: "Overkill if the state machine has only 2 simple states that rarely change.",
          bestFor: "Complex order lifecycles, payment workflows, game AI states, document publishing flows."
        },
        {
          option: "Enum with Switch Cases",
          pros: "Compact and easy to read for tiny state machines with 2-3 states.",
          cons: "Violates Open/Closed; state machine logic becomes scattered across all business methods.",
          bestFor: "Trivial binary states (e.g. ENABLED / DISABLED)."
        }
      ],
      interviewTip: "Distinguish State from Strategy: While both rely on composition and have similar UML class diagrams, their intent is completely opposite. In Strategy, the client chooses an algorithm once and usually does not change it. In State, the states transition dynamically and automatically as internal operations occur."
    },
    {
      id: "strategy",
      subtopicNumber: "3.9",
      title: "Strategy Pattern",
      subtitle: "Defines a family of algorithms, encapsulates each one, and makes them interchangeable at runtime.",
      readingTime: "7 min read",
      difficulty: "Foundational",
      accent: "#38bdf8",
      keyTakeaways: [
        "Enables selecting an algorithm's implementation dynamically at runtime without modifying the client that uses it.",
        "Replaces bloated conditional statements (`if-else` blocks based on customer tier or payment method) with clean polymorphism.",
        "In modern Java 8+, strategies can be passed directly as concise Lambda expressions (`Comparator.comparing(...)`)."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                         STRATEGY UML CLASS MODEL                        |
+-------------------------------------------------------------------------+
   +-----------------------------+               +-----------------------------+
   |       CheckoutService       |               |        <<interface>>        |
   |          (Context)          |  has-a ---->  |       PricingStrategy       |
   +-----------------------------+               +-----------------------------+
   | - strategy: PricingStrategy |               | + calculate(cents): long    |
   | + setStrategy(s: Strategy)  |               +--------------^--------------+
   | + calculateTotal(): long    |                              |
   +-----------------------------+               +--------------+--------------+
                                                 |                             |
                                  +--------------+--------------+     +--------+--------+
                                  |    VipDiscountStrategy      |     | BlackFridayStrat|
                                  +-----------------------------+     +-----------------+
                                  | + calculate(): 20% off      |     | + calculate():  |
                                  +-----------------------------+     |   50% off       |
                                                                      +-----------------+`,
      blockNodes: [
        { x: 50, y: 120, w: 250, h: 140, stereotype: 'context', title: 'PaymentService (Context)', stroke: '#38bdf8', lines: ['- strategy: PaymentStrategy', '+ setStrategy(s)', '+ process(amount: long)'], tag: 'Context' },
        { x: 550, y: 110, w: 260, h: 140, stereotype: 'interface', title: 'PaymentStrategy', stroke: '#10b981', lines: ['+ pay(amountInCents: long): void'], tag: 'Strategy Interface' },
        { x: 420, y: 320, w: 220, h: 130, stereotype: 'concrete-strat', title: 'CreditCardPayment', stroke: '#f59e0b', lines: ['+ pay(): authorize Visa/MC'], tag: 'Strategy A' },
        { x: 670, y: 320, w: 220, h: 130, stereotype: 'concrete-strat', title: 'CryptoPayment', stroke: '#a855f7', lines: ['+ pay(): verify blockchain'], tag: 'Strategy B' }
      ],
      blockConns: [
        { d: 'M 300 170 L 550 170', lx: 425, ly: 155, label: 'delegates to' },
        { d: 'M 530 320 L 630 250', lx: 570, ly: 285, label: 'implements' },
        { d: 'M 780 320 L 710 250', lx: 755, ly: 285, label: 'implements' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'User Selects Payment', stroke: '#38bdf8', lines: ['User clicks "Pay with Crypto"', 'Client instantiates CryptoStrategy', 'Injected into Context'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Service Execution', stroke: '#10b981', lines: ['Context calls strategy.pay()', 'Context has zero crypto logic', 'Pure polymorphic dispatch'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'Dynamic Switch', stroke: '#f59e0b', lines: ['Payment fails / user switches', 'Swaps to CreditCardStrategy', 'No redeployment or restart'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Success Confirmation', stroke: '#a855f7', lines: ['Card transaction completes', 'Receipt dispatched to caller', 'Complete algorithm isolation'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'inject' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'execute' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 're-try' }
      ],
      sections: [
        {
          heading: "Runtime Algorithm Swapping and Lambda Modernization",
          body: "When business logic requires computing shipping rates (FedEx vs UPS vs DHL) or applying discounts (Black Friday vs Student vs VIP), hardcoding algorithms with nested if-else branches creates high cyclomatic complexity. The Strategy pattern isolates each algorithm into a standalone class sharing a common interface.",
          bullets: [
            "Open/Closed Principle: Introduce brand new pricing or routing strategies without touching the context class.",
            "Functional Programming Bridge: In Java 21, single-method strategy interfaces (`@FunctionalInterface`) can be implemented as lambda expressions, cutting boilerplate to 1 line.",
            "Testability: Algorithms can be isolated and unit-tested in isolation without mocking the entire context."
          ],
          codeSnippet: {
            title: "Modern Functional Strategy Pattern in Java 21",
            code: `@FunctionalInterface
public interface DiscountStrategy {
    long applyDiscount(long priceInCents);
}

public class OrderCheckout {
    private DiscountStrategy discountStrategy;

    public OrderCheckout(DiscountStrategy discountStrategy) {
        this.discountStrategy = discountStrategy;
    }

    public void setDiscountStrategy(DiscountStrategy strategy) {
        this.discountStrategy = strategy;
    }

    public long calculateTotal(long originalPrice) {
        return discountStrategy.applyDiscount(originalPrice);
    }
}

// Usage with Modern Lambdas
public class Main {
    public static void main(String[] args) {
        OrderCheckout checkout = new OrderCheckout(p -> (long) (p * 0.8)); // 20% off
        System.out.println("VIP Total: " + checkout.calculateTotal(10000)); // 8000

        checkout.setDiscountStrategy(p -> p - 1500); // $15 flat coupon
        System.out.println("Coupon Total: " + checkout.calculateTotal(10000)); // 8500
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/strategy-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Strategy Pattern",
          pros: "Isolates algorithms; hot-swappable at runtime; completely eliminates if-else chains.",
          cons: "Clients must be aware of differences between strategies to select the right one.",
          bestFor: "Sorting engines, routing algorithms, payment methods, compression formats."
        },
        {
          option: "Hardcoded Procedural If-Else",
          pros: "No interfaces needed; simple for 1-2 invariant calculations.",
          cons: "Violates Open/Closed; editing algorithms requires modifying existing code, risking regressions.",
          bestFor: "Fixed, unchanging formula calculations."
        }
      ],
      interviewTip: "Highlight that in modern Java, Strategy is often combined with Lambdas and Method References: `Collections.sort(list, Comparator.comparing(User::getAge))` is a pure production manifestation of the Strategy pattern."
    },
    {
      id: "template-method",
      subtopicNumber: "3.10",
      title: "Template Method Pattern",
      subtitle: "Defines the skeleton of an algorithm in an operation, deferring some steps to subclasses without changing the algorithm's structure.",
      readingTime: "7 min read",
      difficulty: "Foundational",
      accent: "#a855f7",
      keyTakeaways: [
        "Defines an algorithm's invariant steps in a `final` base class method, allowing subclasses to override specific hook steps.",
        "Enforces the 'Hollywood Principle' ('Don't call us, we'll call you'): the base class calls the subclass methods, never the reverse.",
        "Underpins build automation pipelines (CI/CD), data miners (parse -> extract -> load), and Spring `JdbcTemplate`."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                      TEMPLATE METHOD UML CLASS MODEL                    |
+-------------------------------------------------------------------------+
                     +----------------------------------+
                     |           <<abstract>>           |
                     |         DataMiner (Base)         |
                     +----------------------------------+
                     | + mineData(): void {final}       |  <-- Invariant Skeleton
                     | # openFile(): void               |
                     | # extractData(): void {abstract} |  <-- Subclass Hook
                     | # closeFile(): void              |
                     +-----------------^----------------+
                                       |
             +-------------------------+-------------------------+
             |                                                   |
+------------+------------+                         +------------+------------+
|      PdfDataMiner       |                         |       CsvDataMiner      |
+-------------------------+                         +-------------------------+
| # extractData(): PDF    |                         | # extractData(): CSV    |
+-------------------------+                         +-------------------------+`,
      blockNodes: [
        { x: 300, y: 100, w: 320, h: 180, stereotype: 'abstract', title: 'DataMinerPipeline (Base)', stroke: '#a855f7', lines: ['+ mine(): void {final skeleton}', '# openFile(): void', '# extractData(): void {abstract}', '# parseData(): void {abstract}', '# closeFile(): void'], tag: 'Template Method' },
        { x: 100, y: 340, w: 240, h: 130, stereotype: 'concrete', title: 'PdfDataMiner', stroke: '#38bdf8', lines: ['# extractData(): parse PDF streams', '# parseData(): extract fonts'], tag: 'Subclass A' },
        { x: 580, y: 340, w: 240, h: 130, stereotype: 'concrete', title: 'CsvDataMiner', stroke: '#10b981', lines: ['# extractData(): split commas', '# parseData(): build records'], tag: 'Subclass B' }
      ],
      blockConns: [
        { d: 'M 220 340 L 380 280', lx: 280, ly: 300, label: 'extends' },
        { d: 'M 700 340 L 540 280', lx: 640, ly: 300, label: 'extends' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'mine() Invocation', stroke: '#a855f7', lines: ['Client calls miner.mine()', 'Fixed execution workflow begins', 'Skeleton controls step ordering'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Invariant File Open', stroke: '#38bdf8', lines: ['Base class opens file handle', 'Common error logging executed', 'Zero subclass code duplication'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'Polymorphic Hook', stroke: '#10b981', lines: ['Calls extractData() hook', 'PDF subclass parses binary stream', 'Subclass hook resolves'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Invariant Cleanup', stroke: '#f59e0b', lines: ['Base class closes file stream', 'Logs metrics and telemetry', 'Guaranteed finally cleanup'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'open' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'hook' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'clean' }
      ],
      sections: [
        {
          heading: "Inversion of Control and Invariant Algorithm Skeletons",
          body: "When multiple classes implement the same algorithmic workflow with only small differences in specific steps (e.g. data mining pipelines where opening files and closing files is identical, but data parsing differs), duplicating the algorithm creates severe maintenance hazards. The Template Method marks the skeleton method `final` and leaves specific steps `abstract`.",
          bullets: [
            "DRY (Don't Repeat Yourself): Consolidates duplicate boilerplate workflow code into a single shared superclass.",
            "Guaranteed Cleanup: Invariant steps like database connection closing, telemetry emission, or transaction commit are guaranteed to run.",
            "Liskov Substitution Principle: Subclasses preserve the overarching behavior of the superclass while refining details."
          ],
          codeSnippet: {
            title: "ETL Pipeline Template Method in Java 21",
            code: `public abstract class EtlPipeline {
    // The Template Method (sealed with final)
    public final void runPipeline(String source) {
        connect(source);
        byte[] rawData = extract();
        String transformed = transform(rawData);
        load(transformed);
        disconnect();
    }

    private void connect(String source) { System.out.println("Connecting to: " + source); }
    private void disconnect() { System.out.println("Disconnected cleanly."); }

    // Abstract hooks for subclasses
    protected abstract byte[] extract();
    protected abstract String transform(byte[] rawData);
    protected abstract void load(String processedData);
}

public class S3EtlPipeline extends EtlPipeline {
    @Override protected byte[] extract() { return "s3_raw_bytes".getBytes(); }
    @Override protected String transform(byte[] raw) { return new String(raw).toUpperCase(); }
    @Override protected void load(String data) { System.out.println("Loaded to Snowflake: " + data); }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/template-method-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Template Method Pattern",
          pros: "Eliminates duplicate workflow logic; guarantees invariant steps run in exact order.",
          cons: "Tightly bound by inheritance; subclasses cannot alter the ordering of steps.",
          bestFor: "Build systems, ETL pipelines, standard web request lifecycles."
        },
        {
          option: "Strategy Pattern with Composition",
          pros: "More flexible; steps can be swapped independently at runtime without subclassing.",
          cons: "Requires instantiating and coordinating multiple strategy objects.",
          bestFor: "Workflows where individual steps vary completely independently."
        }
      ],
      interviewTip: "Be ready to explain the 'Hollywood Principle' ('Don't call us, we'll call you') in the context of Template Method vs Strategy: Template Method uses Inheritance (superclass calls subclass methods); Strategy uses Composition (context calls interface methods)."
    },
    {
      id: "visitor",
      subtopicNumber: "3.11",
      title: "Visitor Pattern",
      subtitle: "Separates an algorithm from the object structure on which it operates, allowing new operations to be added without modifying the structure.",
      readingTime: "8 min read",
      difficulty: "Advanced",
      accent: "#ef4444",
      keyTakeaways: [
        "Uses 'Double Dispatch' (`element.accept(visitor)` -> `visitor.visit(this)`) to execute the appropriate operation based on both the element type and the visitor type.",
        "Allows adding new operations (e.g. JSON export, XML export, pricing calculation) across complex object structures without modifying the element classes.",
        "Heavily used in compilers (AST tree traversal and type checking) and DOM document serializers."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                          VISITOR UML CLASS MODEL                        |
+-------------------------------------------------------------------------+
   +-----------------------------+               +-----------------------------+
   |        <<interface>>        |               |        <<interface>>        |
   |           Element           |               |           Visitor           |
   +-----------------------------+               +-----------------------------+
   | + accept(v: Visitor): void  |               | + visit(c: Circle): void    |
   +--------------^--------------+               | + visit(r: Rectangle): void |
                  |                              +--------------^--------------+
   +--------------+--------------+                              |
   |                             |               +--------------+--------------+
+--+----------+           +------+-----+   +-----+------+         +------------+----+
|   Circle    |           |  Rectangle |   |  XmlExport |         | JsonExportVisitor|
+-------------+           +------------+   +------------+         +-----------------+
| + accept(v) |           | + accept(v)|   | + visit(c) |         | + visit(c)      |
|   -> v.visit|           |   -> v.visit   | + visit(r) |         | + visit(r)      |
+-------------+           +------------+   +------------+         +-----------------+`,
      blockNodes: [
        { x: 50, y: 100, w: 250, h: 140, stereotype: 'element', title: 'ReportElement', stroke: '#ef4444', lines: ['+ accept(v: Visitor): void'], tag: 'Element Interface' },
        { x: 550, y: 100, w: 270, h: 150, stereotype: 'visitor', title: 'Visitor', stroke: '#10b981', lines: ['+ visit(user: UserElement)', '+ visit(order: OrderElement)'], tag: 'Visitor Interface' },
        { x: 50, y: 310, w: 250, h: 130, stereotype: 'concrete-elem', title: 'UserElement', stroke: '#38bdf8', lines: ['+ accept(v: Visitor): void', '  -> v.visit(this) [Double Dispatch]'], tag: 'Concrete Element' },
        { x: 550, y: 310, w: 270, h: 130, stereotype: 'concrete-vis', title: 'PdfExportVisitor', stroke: '#f59e0b', lines: ['+ visit(user): render User PDF', '+ visit(order): render Order PDF'], tag: 'Concrete Visitor' }
      ],
      blockConns: [
        { d: 'M 175 310 L 175 240', lx: 175, ly: 275, label: 'implements' },
        { d: 'M 685 310 L 685 250', lx: 685, ly: 275, label: 'implements' },
        { d: 'M 300 375 L 550 375', lx: 425, ly: 360, label: 'double dispatches' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'Client Invokes accept()', stroke: '#ef4444', lines: ['Client creates PdfVisitor', 'Calls element.accept(visitor)', 'First polymorphic dispatch'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Double Dispatch Trigger', stroke: '#38bdf8', lines: ['element executes accept()', 'Passes "this" (UserElement)', 'Second polymorphic dispatch'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'Visitor visit(User) Runs', stroke: '#10b981', lines: ['visitor.visit(UserElement) executes', 'Knows exact runtime type', 'Extracts fields for PDF'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'New Visitor Extensibility', stroke: '#f59e0b', lines: ['Add XmlExportVisitor later', 'Zero changes to UserElement', 'Clean separation of concerns'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'accept' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'visit(this)' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'export' }
      ],
      sections: [
        {
          heading: "Double Dispatch Mechanics and Clean Separation of Algorithms",
          body: "Imagine having a geometric shape tree (Circle, Square). If you need to add export functions (`exportXML`, `exportJSON`, `exportSVG`), adding these methods to Circle and Square pollutes domain classes with serialization logic. Every new export format forces editing every shape class. The Visitor pattern moves these operations into standalone Visitor classes without changing the shapes.",
          bullets: [
            "Open/Closed Principle: You can introduce powerful new operations over complex object graphs without editing element classes.",
            "Single Responsibility Principle: Consolidates related operations for multiple classes into a single visitor class.",
            "Double Dispatch Explained: Single dispatch (standard Java) binds methods based only on the runtime type of the receiver. Visitor binds based on BOTH the element and the visitor."
          ],
          codeSnippet: {
            title: "Double-Dispatch Compiler AST Visitor in Java 21",
            code: `// Element Interface
public interface AstNode {
    void accept(AstVisitor visitor);
}

// Visitor Interface
public interface AstVisitor {
    void visit(LiteralNode node);
    void visit(BinaryOpNode node);
}

// Concrete Elements
public record LiteralNode(int value) implements AstNode {
    @Override public void accept(AstVisitor visitor) {
        visitor.visit(this); // Double dispatch
    }
}

public record BinaryOpNode(String op, AstNode left, AstNode right) implements AstNode {
    @Override public void accept(AstVisitor visitor) {
        visitor.visit(this); // Double dispatch
    }
}

// Concrete Visitor: Pretty Printer
public class PrettyPrintVisitor implements AstVisitor {
    @Override public void visit(LiteralNode node) {
        System.out.print(node.value());
    }

    @Override public void visit(BinaryOpNode node) {
        System.out.print("(");
        node.left().accept(this);
        System.out.print(" " + node.op() + " ");
        node.right().accept(this);
        System.out.print(")");
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/visitor-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Visitor Pattern",
          pros: "Adding new operations across many classes is trivial; groups related algorithms together.",
          cons: "Adding a new Element class forces updating every single Visitor class in the codebase.",
          bestFor: "AST compilers, document serializers, static code analysis rules."
        },
        {
          option: "Direct Methods on Domain Classes",
          pros: "Simple when the set of element classes changes frequently.",
          cons: "Pollutes domain models with disparate export and rendering logic.",
          bestFor: "Rapid prototypes where operations rarely change."
        }
      ],
      interviewTip: "In interviews, clearly define why Double Dispatch is needed in Java: Java method overloading is resolved statically at compile time, while method overriding is resolved dynamically at runtime. Visitor achieves dynamic dispatch on both arguments."
    }
  ]
};

module.exports = { BEHAVIORAL_PATTERNS };
