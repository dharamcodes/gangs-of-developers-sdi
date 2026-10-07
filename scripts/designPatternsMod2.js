 

const STRUCTURAL_PATTERNS = {
  id: "structural-patterns",
  topicNumber: 2,
  title: "2. Structural Patterns",
  description: "Assembling objects and classes into larger, flexible structures while keeping systems efficient and decoupled: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, and Proxy.",
  subtopics: [
    {
      id: "adapter",
      subtopicNumber: "2.1",
      title: "Adapter Pattern",
      subtitle: "Allows objects with incompatible interfaces to collaborate by converting the interface of a class into another interface clients expect.",
      readingTime: "7 min read",
      difficulty: "Foundational",
      accent: "#38bdf8",
      keyTakeaways: [
        "Acts as a translator wrapper between two existing, incompatible APIs or legacy interfaces.",
        "Object Adapter uses object composition (wraps Adaptee instance) rather than multiple inheritance, which is favored by the 'composition over inheritance' design principle.",
        "Essential when integrating third-party SDKs, legacy SOAP services, or differing data format schemas without polluting core domain models."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                         ADAPTER UML CLASS MODEL                         |
+-------------------------------------------------------------------------+
+-----------------------+              +-----------------------+
|        Client         |  uses --->   |     <<interface>>     |
|                       |              |     PaymentGateway    |
+-----------------------+              +-----------------------+
                                       | + pay(cents): boolean |
                                       +-----------^-----------+
                                                   | implements
                                       +-----------+-----------+
                                       |     StripeAdapter     |
                                       +-----------------------+
                                       | - stripeSdk: StripeApi|
                                       | + pay(cents): boolean |
                                       +-----------+-----------+
                                                   | delegates to
                                       +-----------v-----------+
                                       |   Legacy StripeApi    |
                                       +-----------------------+
                                       | + makeCharge(currency)|
                                       +-----------------------+`,
      blockNodes: [
        { x: 50, y: 120, w: 200, h: 120, stereotype: 'client', title: 'PaymentService', stroke: '#38bdf8', lines: ['Client business logic', 'Calls gateway.pay()'], tag: 'Client' },
        { x: 340, y: 110, w: 240, h: 130, stereotype: 'interface', title: 'PaymentGateway', stroke: '#10b981', lines: ['+ pay(cents: long): bool'], tag: 'Target Interface' },
        { x: 340, y: 310, w: 240, h: 140, stereotype: 'adapter', title: 'StripePaymentAdapter', stroke: '#f59e0b', lines: ['- stripeClient: StripeSdk', '+ pay(cents): bool', '  -> adapts dollars & params'], tag: 'Adapter' },
        { x: 670, y: 310, w: 230, h: 140, stereotype: 'adaptee', title: 'StripeSdk (External)', stroke: '#ef4444', lines: ['+ createCharge(amount: BigDecimal, curr: String)'], tag: 'Adaptee' }
      ],
      blockConns: [
        { d: 'M 250 170 L 340 170', lx: 295, ly: 160, label: 'uses' },
        { d: 'M 460 310 L 460 240', lx: 460, ly: 275, label: 'implements' },
        { d: 'M 580 380 L 670 380', lx: 625, ly: 370, label: 'delegates' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'Client Payment Call', stroke: '#38bdf8', lines: ['Client invokes pay(5000)', 'Uses domain gateway interface', 'Zero vendor details exposed'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Adapter Translation', stroke: '#f59e0b', lines: ['Translates cents to Dollars', 'Constructs vendor payload', 'Maps auth tokens & telemetry'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'Adaptee Execution', stroke: '#ef4444', lines: ['Stripe SDK executes RPC', 'Processes charge at bank', 'Returns proprietary DTO'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Normalized Response', stroke: '#10b981', lines: ['Adapter catches exceptions', 'Translates to domain status', 'Returns clean boolean to client'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'pay()' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'charge()' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'normalize' }
      ],
      sections: [
        {
          heading: "Bridging Legacy Interfaces and Vendor SDK Boundaries",
          body: "In production engineering, third-party libraries and legacy internal systems rarely match modern internal domain interfaces. Without an adapter, vendor-specific method names, exceptions, and argument structures leak directly into core application business logic, locking your system to a single vendor. The Adapter pattern encapsulates third-party interactions behind a standard internal domain interface.",
          bullets: [
            "Single Responsibility Principle: Data conversion and vendor translation logic is cleanly separated from primary business rules.",
            "Open/Closed Principle: You can swap payment providers (e.g., Stripe to Adyen or PayPal) simply by introducing a new adapter class without changing a single line of client code.",
            "Encapsulates Vendor Exceptions: Translates vendor-specific HTTP/gRPC runtime exceptions into domain-level checked/unchecked exceptions."
          ],
          codeSnippet: {
            title: "Production Adapter Pattern in Java 21",
            code: `// Domain Target Interface
public interface PaymentProcessor {
    boolean processPayment(String customerId, long amountInCents);
}

// Incompatible Third-Party SDK
public class LegacyPayPalService {
    public int sendMoney(String email, double amountInDollars, String token) {
        System.out.printf("PayPal: Charged $%.2f for %s%n", amountInDollars, email);
        return 200; // Success code
    }
}

// The Object Adapter
public class PayPalPaymentAdapter implements PaymentProcessor {
    private final LegacyPayPalService payPalService;
    private final String apiToken;

    public PayPalPaymentAdapter(LegacyPayPalService payPalService, String apiToken) {
        this.payPalService = payPalService;
        this.apiToken = apiToken;
    }

    @Override
    public boolean processPayment(String customerId, long amountInCents) {
        // Adapt parameters: convert cents to dollars
        double dollars = amountInCents / 100.0;
        int responseCode = payPalService.sendMoney(customerId, dollars, apiToken);
        return responseCode == 200;
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/adapter-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Adapter Pattern",
          pros: "Protects business logic from vendor lock-in, enables seamless mocking in unit tests.",
          cons: "Adds an additional layer of method indirection and small object memory overhead.",
          bestFor: "Integrating third-party SDKs, payment gateways, cloud vendor storage services."
        },
        {
          option: "Direct SDK Invocation",
          pros: "Faster to code initially; direct access to all vendor-specific parameters.",
          cons: "Tightly couples your entire application to external APIs; replacing the SDK requires rewriting all callers.",
          bestFor: "Disposable prototypes and small internal scripts."
        }
      ],
      interviewTip: "Distinguish between Object Adapter (composition based, wraps the adaptee instance) and Class Adapter (uses multiple inheritance to inherit both interfaces, impossible in Java classes). Always emphasize that Object Adapter is superior because it can adapt any subclass of the adaptee."
    },
    {
      id: "bridge",
      subtopicNumber: "2.2",
      title: "Bridge Pattern",
      subtitle: "Decouples an abstraction from its implementation so that the two can vary independently.",
      readingTime: "8 min read",
      difficulty: "Advanced",
      accent: "#a855f7",
      keyTakeaways: [
        "Prevents a Cartesian Product explosion of class hierarchies (e.g. $M$ abstractions $\\times$ $N$ platforms = $M \\times N$ classes) by splitting them into two independent dimensions: Abstraction and Implementation.",
        "Replaces deep inheritance hierarchies with composition: the Abstraction maintains a reference to the Implementor.",
        "Widely used in cross-platform rendering engines, driver architectures (JDBC), and multi-channel notification dispatchers."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                          BRIDGE UML CLASS MODEL                         |
+-------------------------------------------------------------------------+
    [Abstraction Hierarchy]                    [Implementor Hierarchy]
  +--------------------------+               +--------------------------+
  |    RemoteControl (Abs)   |  has-a ---->  |     <<interface>>        |
  +--------------------------+               |     Device (Impl)        |
  | # device: Device         |               +--------------------------+
  | + togglePower(): void    |               | + isEnabled(): boolean   |
  +------------^-------------+               | + enable(): void         |
               |                             +------------^-------------+
  +------------+-------------+                            |
  |   AdvancedRemoteControl  |               +------------+-------------+
  +--------------------------+               |                          |
  | + mute(): void           |     +---------+--------+       +---------+--------+
  +--------------------------+     |    TvDevice      |       |   RadioDevice    |
                                   +------------------+       +------------------+`,
      blockNodes: [
        { x: 50, y: 110, w: 250, h: 140, stereotype: 'abstraction', title: 'NotificationSender', stroke: '#a855f7', lines: ['# channel: MessageChannel', '+ sendAlert(msg): void'], tag: 'Abstraction' },
        { x: 50, y: 320, w: 250, h: 130, stereotype: 'refined-abs', title: 'EmergencyNotifier', stroke: '#a855f7', lines: ['+ broadcastUrgent(msg)', '  -> retries & escalates'], tag: 'Refined Abstraction' },
        { x: 550, y: 110, w: 250, h: 140, stereotype: 'implementor', title: 'MessageChannel', stroke: '#10b981', lines: ['+ deliver(payload): void', '+ getProtocol(): String'], tag: 'Implementor' },
        { x: 420, y: 320, w: 220, h: 130, stereotype: 'concrete-impl', title: 'TwilioSmsChannel', stroke: '#38bdf8', lines: ['+ deliver(): [SMS Gateway]'], tag: 'Concrete Impl A' },
        { x: 670, y: 320, w: 220, h: 130, stereotype: 'concrete-impl', title: 'SlackWebhookChannel', stroke: '#f59e0b', lines: ['+ deliver(): [Slack API]'], tag: 'Concrete Impl B' }
      ],
      blockConns: [
        { d: 'M 175 320 L 175 250', lx: 175, ly: 285, label: 'extends' },
        { d: 'M 300 170 L 550 170', lx: 425, ly: 155, label: 'has-a Bridge' },
        { d: 'M 530 320 L 630 250', lx: 570, ly: 285, label: 'implements' },
        { d: 'M 780 320 L 710 250', lx: 755, ly: 285, label: 'implements' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'Client Invocation', stroke: '#a855f7', lines: ['Client creates EmergencyNotifier', 'Injects SlackChannel at runtime', 'Calls sendUrgentAlert()'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Abstraction Logic', stroke: '#f59e0b', lines: ['Applies high-level logic', 'Formats alert markdown', 'Applies retry policies'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'Bridge Delegation', stroke: '#38bdf8', lines: ['Notifier delegates to channel', 'Calls channel.deliver()', 'Agnostic of channel transport'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Protocol Delivery', stroke: '#10b981', lines: ['SlackWebhook dispatches HTTP', 'Zero inheritance coupling', 'Swap channel in 1 line'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'call' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'bridge' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'execute' }
      ],
      sections: [
        {
          heading: "Solving Class Explosions via Orthogonal Dimension Decomposition",
          body: "Consider a UI framework with shapes (Circle, Square) and colors (Red, Blue). In inheritance, adding 1 shape and 1 color requires creating RedCircle, BlueCircle, RedSquare, BlueSquare. If you have 10 shapes and 5 colors, you need 50 subclasses! The Bridge pattern decouples Shape (the abstraction) from Color (the implementation) into two separate class trees connected by object composition.",
          bullets: [
            "Eliminates Class Multiplications: With Bridge, $M$ shapes and $N$ colors requires only $M + N$ classes instead of $M \\times N$.",
            "Runtime Implementation Switching: The client can change the underlying implementor of an abstraction at runtime.",
            "True Information Hiding: Completely hides platform-dependent hardware/OS details from consumer code."
          ],
          codeSnippet: {
            title: "Decoupled Notification Architecture in Java 21",
            code: `// Implementor Interface
public interface DeliveryChannel {
    void transmit(String recipient, String payload);
}

// Concrete Implementors
public class SmsDeliveryChannel implements DeliveryChannel {
    @Override public void transmit(String recipient, String payload) {
        System.out.printf("SMS sent to %s: %s%n", recipient, payload);
    }
}

public class EmailDeliveryChannel implements DeliveryChannel {
    @Override public void transmit(String recipient, String payload) {
        System.out.printf("Email sent to %s: %s%n", recipient, payload);
    }
}

// Abstraction
public abstract class Notification {
    protected final DeliveryChannel channel; // The Bridge
    protected Notification(DeliveryChannel channel) { this.channel = channel; }
    public abstract void notifyUser(String user, String message);
}

// Refined Abstraction
public class UrgentAlertNotification extends Notification {
    public UrgentAlertNotification(DeliveryChannel channel) { super(channel); }

    @Override
    public void notifyUser(String user, String message) {
        String formatted = "[URGENT-P0] " + message.toUpperCase();
        channel.transmit(user, formatted);
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/bridge-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Bridge Pattern",
          pros: "Prevents combinatorial subclass explosions; decouples high-level policy from low-level mechanisms.",
          cons: "Increases structural complexity; high cognitive load if the two dimensions are not truly orthogonal.",
          bestFor: "Cross-platform graphics engines, database connectivity drivers (JDBC), complex notification engines."
        },
        {
          option: "Monolithic Class Inheritance",
          pros: "Simple and straightforward for small domains with only 2-3 fixed variants.",
          cons: "Combinatorial explosion: adding new platforms requires multiplying classes across the entire codebase.",
          bestFor: "Static domains with zero likelihood of new platform variants."
        }
      ],
      interviewTip: "Interviewers frequently ask candidates to contrast Bridge vs Adapter. Explain: Adapter is applied *after* systems are built to make incompatible third-party interfaces work together. Bridge is designed *up front* to let abstraction and implementation evolve independently."
    },
    {
      id: "composite",
      subtopicNumber: "2.3",
      title: "Composite Pattern",
      subtitle: "Composes objects into tree structures to represent part-whole hierarchies, letting clients treat individual objects and compositions uniformly.",
      readingTime: "7 min read",
      difficulty: "Intermediate",
      accent: "#10b981",
      keyTakeaways: [
        "Enables recursive tree data structures where single Leaf nodes and complex Composite branches share the exact same interface.",
        "Clients do not need to check `if (node instanceof Leaf)` or write nested typecasting loops; calling `execute()` on the root propagates down the entire hierarchy.",
        "Underpins modern UI DOM trees, organizational hierarchies, file system structures, and financial portfolio valuation calculations."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                        COMPOSITE UML CLASS MODEL                        |
+-------------------------------------------------------------------------+
                         +-----------------------------+
                         |        <<interface>>        |
                         |          Component          |
                         +-----------------------------+
                         | + getPrice(): BigDecimal    |
                         | + displayHierarchy(): void  |
                         +--------------^--------------+
                                        |
               +------------------------+------------------------+
               |                                                 |
+--------------+--------------+                   +--------------+--------------+
|        Product (Leaf)       |                   |       Box (Composite)       |
+-----------------------------+                   +-----------------------------+
| - price: BigDecimal         |                   | - children: List<Component> |
| + getPrice(): BigDecimal    |                   | + add(c: Component): void   |
+-----------------------------+                   | + getPrice(): [Recursive]   |
                                                  +-----------------------------+`,
      blockNodes: [
        { x: 320, y: 100, w: 260, h: 140, stereotype: 'interface', title: 'FileSystemItem', stroke: '#10b981', lines: ['+ getSize(): long', '+ printTree(indent): void'], tag: 'Component' },
        { x: 100, y: 310, w: 250, h: 130, stereotype: 'leaf', title: 'File (Leaf)', stroke: '#38bdf8', lines: ['- sizeInBytes: long', '+ getSize(): long', '  -> returns exact file size'], tag: 'Leaf' },
        { x: 550, y: 310, w: 270, h: 150, stereotype: 'composite', title: 'Directory (Composite)', stroke: '#f59e0b', lines: ['- items: List<FileSystemItem>', '+ add(item): void', '+ getSize(): long (sum children)'], tag: 'Composite' }
      ],
      blockConns: [
        { d: 'M 225 310 L 370 240', lx: 280, ly: 265, label: 'implements' },
        { d: 'M 685 310 L 530 240', lx: 635, ly: 265, label: 'implements' },
        { d: 'M 820 385 C 870 385 870 170 580 170', lx: 870, ly: 270, label: 'contains children' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'Root Invocation', stroke: '#10b981', lines: ['Client calls rootDir.getSize()', 'Client has no knowledge of tree depth', 'Treats root as Component'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Recursive Traversal', stroke: '#f59e0b', lines: ['Directory loops through children', 'Calls item.getSize() on each', 'Branches recurse into subdirectories'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'Leaf Base Case', stroke: '#38bdf8', lines: ['Individual File leaves return size', 'No child loops on leaves', 'Accumulates into branch sum'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Aggregated Total', stroke: '#a855f7', lines: ['Total bytes returned to root', 'Clean single return value', 'Zero instanceof checks needed'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'recurse' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'leaf evaluate' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'aggregate' }
      ],
      sections: [
        {
          heading: "Uniform Treatment of Part-Whole Hierarchies",
          body: "In complex domain trees like e-commerce packaging (boxes containing smaller boxes and individual products) or graphic renderers (groups containing shapes and other nested groups), writing special-cased code for leaves versus containers results in brittle switch statements. The Composite pattern enables clients to treat nested trees as if they were a single object.",
          bullets: [
            "Polymorphic Recursion: Complex hierarchies calculate results through natural recursive polymorphism.",
            "Open/Closed Principle: Introduce new leaf components or container types without changing client code.",
            "Simplified Client Logic: Eliminates cumbersome typecasting and deep nested iterative loops."
          ],
          codeSnippet: {
            title: "Composite File System Architecture in Java 21",
            code: `// Component Interface
public interface FileSystemNode {
    long calculateSizeBytes();
    void render(int depth);
}

// Leaf Node
public record FileLeaf(String name, long size) implements FileSystemNode {
    @Override public long calculateSizeBytes() { return size; }
    @Override public void render(int depth) {
        System.out.printf("%s- File: %s (%d bytes)%n", "  ".repeat(depth), name, size);
    }
}

// Composite Node
public class DirectoryComposite implements FileSystemNode {
    private final String name;
    private final List<FileSystemNode> children = new ArrayList<>();

    public DirectoryComposite(String name) { this.name = name; }
    public void add(FileSystemNode node) { children.add(node); }

    @Override
    public long calculateSizeBytes() {
        return children.stream().mapToLong(FileSystemNode::calculateSizeBytes).sum();
    }

    @Override
    public void render(int depth) {
        System.out.printf("%s+ Dir: %s%n", "  ".repeat(depth), name);
        for (FileSystemNode child : children) child.render(depth + 1);
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/composite-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Composite Pattern",
          pros: "Simplifies client code; easy to add new component types; uniform recursive processing.",
          cons: "Difficult to restrict which child components can be added to specific composite containers at compile time.",
          bestFor: "UI document trees, AST compilers, nested pricing & packaging systems, organization charts."
        },
        {
          option: "Flat Class Hierarchies with Collections",
          pros: "Strict compile-time type safety; prevents accidental nesting of illegal combinations.",
          cons: "Requires custom traversal and aggregation logic for every new container type.",
          bestFor: "Strictly shallow, non-recursive parent-child relationships."
        }
      ],
      interviewTip: "When discussing Composite, address the trade-off between Transparency (defining child management methods like `add()` and `remove()` in the base Component interface) versus Safety (defining them only on the Composite class). Explain why Safety is generally preferred in strongly-typed languages like Java."
    },
    {
      id: "decorator",
      subtopicNumber: "2.4",
      title: "Decorator Pattern",
      subtitle: "Attaches additional responsibilities to an object dynamically, providing a flexible alternative to subclassing for extending functionality.",
      readingTime: "8 min read",
      difficulty: "Foundational",
      accent: "#f59e0b",
      keyTakeaways: [
        "Adds behavior to individual objects dynamically at runtime without affecting other instances of the same class.",
        "Follows the Open/Closed Principle: extend functionality via wrapper layers without modifying existing classes.",
        "Found throughout Java I/O (`new BufferedReader(new InputStreamReader(new FileInputStream(file)))`) and HTTP middleware filter chains."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                        DECORATOR UML CLASS MODEL                        |
+-------------------------------------------------------------------------+
                      +-----------------------------+
                      |        <<interface>>        |
                      |          DataSource         |
                      +-----------------------------+
                      | + writeData(data): void     |
                      | + readData(): String        |
                      +--------------^--------------+
                                     |
             +-----------------------+-----------------------+
             |                                               |
+------------+------------+                     +------------+------------+
|     FileDataSource      |                     |   DataSourceDecorator   |
+-------------------------+                     +-------------------------+
| + writeData(): [Disk]   |                     | - wrappee: DataSource   |
+-------------------------+                     | + writeData(): delegate |
                                                +------------^------------+
                                                             |
                                      +----------------------+----------------------+
                                      |                                             |
                         +------------+------------+                   +------------+------------+
                         |   EncryptionDecorator   |                   |   CompressionDecorator  |
                         +-------------------------+                   +-------------------------+
                         | + writeData(): encrypt  |                   | + writeData(): compress |
                         +-------------------------+                   +-------------------------+`,
      blockNodes: [
        { x: 300, y: 100, w: 260, h: 130, stereotype: 'interface', title: 'DataStream', stroke: '#f59e0b', lines: ['+ write(data: byte[]): void', '+ read(): byte[]'], tag: 'Component' },
        { x: 80, y: 290, w: 240, h: 120, stereotype: 'concrete', title: 'FileStream', stroke: '#38bdf8', lines: ['+ write(): raw disk I/O', '+ read(): raw disk read'], tag: 'ConcreteComponent' },
        { x: 500, y: 280, w: 280, h: 140, stereotype: 'decorator-base', title: 'StreamDecorator', stroke: '#a855f7', lines: ['- wrappee: DataStream', '+ write(data): wrappee.write(data)'], tag: 'BaseDecorator' },
        { x: 360, y: 460, w: 220, h: 120, stereotype: 'concrete-dec', title: 'GzipCompressor', stroke: '#10b981', lines: ['+ write(): gzip -> wrappee'], tag: 'Decorator A' },
        { x: 640, y: 460, w: 220, h: 120, stereotype: 'concrete-dec', title: 'AesEncryptor', stroke: '#ef4444', lines: ['+ write(): aes -> wrappee'], tag: 'Decorator B' }
      ],
      blockConns: [
        { d: 'M 200 290 L 370 230', lx: 270, ly: 250, label: 'implements' },
        { d: 'M 640 280 L 490 230', lx: 580, ly: 250, label: 'implements' },
        { d: 'M 780 340 C 850 340 850 160 560 160', lx: 850, ly: 240, label: 'wraps (has-a)' },
        { d: 'M 470 460 L 580 420', lx: 510, ly: 440, label: 'extends' },
        { d: 'M 750 460 L 680 420', lx: 730, ly: 440, label: 'extends' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'Client Invocation', stroke: '#f59e0b', lines: ['Calls stream.write(bytes)', 'Client sees outermost decorator', 'Completely unaware of wrapping chain'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Encryption Pass', stroke: '#ef4444', lines: ['AesEncryptor executes AES-256', 'Encrypts raw input buffer', 'Passes ciphertext to wrappee'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'Compression Pass', stroke: '#10b981', lines: ['GzipCompressor applies deflate', 'Compresses encrypted stream', 'Passes bytes to inner stream'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Raw Disk Write', stroke: '#38bdf8', lines: ['FileStream writes bytes to SSD', 'Return unwinds back up stack', 'Zero class inheritance explosion'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'encrypt' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'compress' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'persist' }
      ],
      sections: [
        {
          heading: "Dynamic Composition Over Static Subclassing",
          body: "Subclassing creates rigid compile-time behavior: if you have a Logger, and you need TimestampLogging, FileLogging, and SlackLogging, creating subclasses for all permutations requires `TimestampSlackLogger`, `TimestampFileLogger`, etc. Decorator replaces this with nested wrappers that can be stacked arbitrarily in any order at runtime.",
          bullets: [
            "Single Responsibility Principle: Each decorator class focuses exclusively on one orthogonal concern (caching, logging, encryption, metrics).",
            "Transparent Wrapping: Since decorators implement the exact same interface as the wrapped object, the caller cannot tell them apart.",
            "Dynamic Assembly: Decorator chains can be assembled conditionally depending on feature flags or configuration files."
          ],
          codeSnippet: {
            title: "Resilient HTTP Client Pipeline using Decorators in Java 21",
            code: `public interface HttpExecution {
    String send(String request);
}

// Base Concrete Component
public class SimpleHttpClient implements HttpExecution {
    @Override public String send(String request) {
        return "200 OK: payload for " + request;
    }
}

// Abstract Decorator
public abstract class HttpDecorator implements HttpExecution {
    protected final HttpExecution inner;
    protected HttpDecorator(HttpExecution inner) { this.inner = inner; }
}

// Concrete Decorator 1: Metrics
public class MetricsHttpDecorator extends HttpDecorator {
    public MetricsHttpDecorator(HttpExecution inner) { super(inner); }
    @Override public String send(String request) {
        long start = System.currentTimeMillis();
        try {
            return inner.send(request);
        } finally {
            System.out.println("Execution latency: " + (System.currentTimeMillis() - start) + "ms");
        }
    }
}

// Concrete Decorator 2: Retries
public class RetryHttpDecorator extends HttpDecorator {
    public RetryHttpDecorator(HttpExecution inner) { super(inner); }
    @Override public String send(String request) {
        for (int i = 0; i < 3; i++) {
            try { return inner.send(request); }
            catch (Exception e) { System.out.println("Retry attempt " + (i + 1)); }
        }
        throw new RuntimeException("All retries exhausted");
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/decorator-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Decorator Pattern",
          pros: "High flexibility, dynamic configuration, eliminates subclass combinatorial explosion.",
          cons: "Debugging deep nested wrappers with stack traces can be tricky; order of decorators matters.",
          bestFor: "Stream processing, HTTP middleware pipelines, caching & logging wrappers, UI widget overlays."
        },
        {
          option: "Subclassing / Inheritance",
          pros: "Straightforward for fixed static variations with zero runtime configuration.",
          cons: "Rigid compile-time binding; cannot combine independent behaviors without duplicating code.",
          bestFor: "Extending classes where behaviors are not composable or stackable."
        }
      ],
      interviewTip: "In interviews, cite `java.io.BufferedReader` and `java.io.InputStream` as the definitive standard library example of the Decorator pattern. Point out that Decorator differs from Proxy because Proxy *controls access* to an object without changing behavior, whereas Decorator *enhances behavior*."
    },
    {
      id: "facade",
      subtopicNumber: "2.5",
      title: "Facade Pattern",
      subtitle: "Provides a unified, simplified interface to a complex subsystem, making the subsystem easier to use.",
      readingTime: "6 min read",
      difficulty: "Foundational",
      accent: "#38bdf8",
      keyTakeaways: [
        "Shields client code from the convoluted internal workings and cascading dependencies of complex subsystems.",
        "Does not encapsulate or lock the subsystem: advanced clients that require fine-grained control can still bypass the Facade to interact directly with subsystem classes.",
        "Crucial for reducing architectural coupling between microservice modules and establishing clean API boundaries."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                          FACADE UML CLASS MODEL                         |
+-------------------------------------------------------------------------+
+------------------+                   +----------------------------------+
|      Client      |   calls ---->     |          OrderFacade             |
+------------------+                   +----------------------------------+
                                       | + placeOrder(cart, card): UUID   |
                                       +-----------------+----------------+
                                                         |
                   +-------------------+-----------------+-------------------+
                   |                   |                                     |
         +---------v--------+  +-------v----------+                +---------v--------+
         | InventoryService |  | PaymentProcessor |                | LogisticsService |
         +------------------+  +------------------+                +------------------+
         | - checkStock()   |  | - authorizeCard()|                | - scheduleTruck()|
         +------------------+  +------------------+                +------------------+`,
      blockNodes: [
        { x: 50, y: 150, w: 200, h: 120, stereotype: 'client', title: 'Web Checkout Controller', stroke: '#38bdf8', lines: ['Client layer', 'Calls facade.checkout()'], tag: 'Client' },
        { x: 340, y: 110, w: 260, h: 170, stereotype: 'facade', title: 'CheckoutFacade', stroke: '#10b981', lines: ['- inventory: StockSvc', '- payment: CardSvc', '- logistics: ShippingSvc', '+ processOrder(): OrderId'], tag: 'Facade' },
        { x: 680, y: 70, w: 230, h: 90, stereotype: 'subsystem', title: 'Inventory Subsystem', stroke: '#f59e0b', lines: ['Lock SKU inventory'], tag: 'Subsystem A' },
        { x: 680, y: 180, w: 230, h: 90, stereotype: 'subsystem', title: 'Payment Gateway', stroke: '#ef4444', lines: ['Stripe 3D-Secure auth'], tag: 'Subsystem B' },
        { x: 680, y: 290, w: 230, h: 90, stereotype: 'subsystem', title: 'FedEx API Shipper', stroke: '#a855f7', lines: ['Generate waybill PDF'], tag: 'Subsystem C' }
      ],
      blockConns: [
        { d: 'M 250 200 L 340 190', lx: 295, ly: 180, label: 'calls simple API' },
        { d: 'M 600 150 L 680 115', lx: 640, ly: 120, label: 'coordinates' },
        { d: 'M 600 190 L 680 225', lx: 640, ly: 195, label: 'coordinates' },
        { d: 'M 600 230 L 680 330', lx: 640, ly: 275, label: 'coordinates' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: '1-Line Checkout', stroke: '#38bdf8', lines: ['Client invokes facade.order()', 'Zero understanding of FedEx/Stripe', 'Single atomic method signature'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Inventory Lock', stroke: '#f59e0b', lines: ['Facade calls Inventory.reserve()', 'Verifies warehouse stock', 'Rolls back on shortage'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'Payment Capture', stroke: '#ef4444', lines: ['Facade authorizes credit card', 'Validates fraud scoring', 'Handles token exchange'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Dispatch & OrderId', stroke: '#10b981', lines: ['Generates FedEx shipping label', 'Persists order database record', 'Returns OrderId to client'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'reserve' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'charge' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'fulfill' }
      ],
      sections: [
        {
          heading: "Taming Subsystem Complexity and Establishing Cohesive Boundaries",
          body: "As enterprise architectures grow, completing a single high-level business requirement often requires orchestrating 5 to 10 independent subsystems. Exposing this orchestration directly to UI controllers creates massive coupling: any change in a subsystem breaks all consumers. A Facade provides an intentional, ergonomic entry point while insulating consumers from lower-level churn.",
          bullets: [
            "Encapsulation without Confinement: Simplifies the 95% common use cases while allowing power users to interact with underlying subsystems directly if required.",
            "Layered Architecture: Facades define natural boundaries between architectural layers in distributed backends.",
            "Reduced Compilation Dependencies: Changes to internal subsystem classes do not force recompilation of client modules."
          ],
          codeSnippet: {
            title: "E-Commerce Checkout Facade in Java 21",
            code: `public record OrderReceipt(UUID orderId, String trackingNumber, boolean successful) {}

public class CheckoutFacade {
    private final InventorySubsystem inventory;
    private final PaymentSubsystem payment;
    private final ShippingSubsystem shipping;

    public CheckoutFacade(InventorySubsystem inventory, PaymentSubsystem payment, ShippingSubsystem shipping) {
        this.inventory = inventory;
        this.payment = payment;
        this.shipping = shipping;
    }

    public OrderReceipt placeOrder(String sku, int quantity, String creditCard, String address) {
        // Step 1: Check and reserve stock
        if (!inventory.reserveStock(sku, quantity)) {
            throw new IllegalStateException("Insufficient inventory for: " + sku);
        }

        // Step 2: Charge payment
        boolean paid = payment.charge(creditCard, inventory.calculatePrice(sku, quantity));
        if (!paid) {
            inventory.releaseStock(sku, quantity);
            throw new PaymentFailedException("Card authorization declined");
        }

        // Step 3: Dispatch shipping
        String tracking = shipping.createShipment(sku, quantity, address);
        return new OrderReceipt(UUID.randomUUID(), tracking, true);
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/facade-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Facade Pattern",
          pros: "Reduces client complexity, minimizes coupling between client code and complex subsystems.",
          cons: "Risk of becoming a 'God Object' if too many disparate responsibilities are crammed into a single facade.",
          bestFor: "Complex SDKs, multi-step business transactions, microservice boundary orchestrators."
        },
        {
          option: "Direct Subsystem Interfacing",
          pros: "Maximum fine-grained control; no extra layer between caller and implementation.",
          cons: "Massive code duplication across clients; high cognitive load on development teams.",
          bestFor: "Specialized tools where clients genuinely need low-level customization of every single parameter."
        }
      ],
      interviewTip: "Emphasize to interviewers that a Facade provides an *optional* simplified interface; it does not hide or seal the subsystem classes. Contrast Facade with Adapter (Adapter adapts one existing interface to another; Facade creates a completely new, simplified interface over many subsystems)."
    },
    {
      id: "flyweight",
      subtopicNumber: "2.6",
      title: "Flyweight Pattern",
      subtitle: "Minimizes memory usage by sharing as much data as possible with similar objects.",
      readingTime: "7 min read",
      difficulty: "Advanced",
      accent: "#a855f7",
      keyTakeaways: [
        "Separates object state into Intrinsic State (invariant, shared across thousands of objects) and Extrinsic State (context-dependent, passed in as method parameters).",
        "Prevents Out-Of-Memory (OOM) errors in graphics engines, gaming entities (particles, bullets, trees), and document text editors (millions of glyph characters).",
        "Powering core Java standard libraries: `Integer.valueOf()` caches numbers -128 to 127 using the Flyweight pattern; Java String deduplication/interning is a classic Flyweight."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                        FLYWEIGHT UML CLASS MODEL                        |
+-------------------------------------------------------------------------+
+-----------------------+              +----------------------------------+
|    TreeFactory        |  caches ---> |       TreeType (Flyweight)       |
+-----------------------+              +----------------------------------+
| - types: Map<String,  |              | - name: String                   |
|          TreeType>    |              | - color: Color    [Intrinsic]    |
| + getTreeType(...)    |              | - texture: byte[]                |
+-----------------------+              +----------------------------------+
                                       | + render(x, y, scale) [Extrinsic]|
                                       +-----------------^----------------+
                                                         | shared by 1,000,000x
                                       +-----------------+----------------+
                                       |         Tree (Context)           |
                                       +----------------------------------+
                                       | - x: int, y: int [Extrinsic]     |
                                       | - type: TreeType [Shared Ref]    |
                                       +----------------------------------+`,
      blockNodes: [
        { x: 50, y: 110, w: 250, h: 140, stereotype: 'factory', title: 'TreeTypeFactory', stroke: '#a855f7', lines: ['- cache: Map<Key, TreeType>', '+ getTreeType(name, color, mesh): TreeType'], tag: 'FlyweightFactory' },
        { x: 380, y: 100, w: 270, h: 160, stereotype: 'flyweight', title: 'TreeType (Flyweight)', stroke: '#10b981', lines: ['- name: String [Intrinsic]', '- 3D Mesh: 50 MB [Intrinsic]', '- Texture: 20 MB [Intrinsic]', '+ draw(x, y, zoom) [Extrinsic]'], tag: 'Shared Memory' },
        { x: 740, y: 110, w: 220, h: 150, stereotype: 'context', title: 'TreeInstance (Context)', stroke: '#38bdf8', lines: ['- x: int, y: int [Extrinsic]', '- health: int [Extrinsic]', '- type: TreeType [Pointer]', 'Cost: 16 bytes each!'], tag: '1M+ Instances' }
      ],
      blockConns: [
        { d: 'M 300 170 L 380 170', lx: 340, ly: 155, label: 'caches' },
        { d: 'M 740 180 L 650 180', lx: 695, ly: 165, label: 'references' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'Spawn Request', stroke: '#a855f7', lines: ['Forest generates 1,000,000 trees', 'Requests "Oak" type from factory', 'Calculates random (x, y) coordinates'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Factory Cache Hit', stroke: '#10b981', lines: ['Factory checks internal map', 'Oak 3D mesh already in memory', 'Returns existing Flyweight pointer'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'Lightweight Allocation', stroke: '#38bdf8', lines: ['Allocates tiny Context record', 'Stores only (x, y) + memory pointer', 'Memory footprint reduced by 99.8%'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Extrinsic Rendering', stroke: '#f59e0b', lines: ['Renderer invokes type.draw(x, y)', 'Flyweight uses GPU texture', 'Seamless 60 FPS rendering'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'lookup' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'pointer' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'render' }
      ],
      sections: [
        {
          heading: "Intrinsic vs Extrinsic State: Slashing Memory Footprints by 99%",
          body: "When rendering a 3D forest with 1,000,000 trees, creating an independent object for each tree that stores its 3D polygon mesh and texture bitmaps requires 100+ Gigabytes of RAM, crashing the JVM. However, 99.9% of that data (the mesh geometry, texture atlas) is identical across all oak trees. Flyweight extracts that invariant data into an immutable shared instance, leaving only coordinates (x, y, z) in the individual tree context.",
          bullets: [
            "Intrinsic State: Stored directly inside the Flyweight object. It is immutable, context-independent, and shared.",
            "Extrinsic State: Belongs to the specific context (position, timestamp, caller ID) and is passed to Flyweight methods on demand.",
            "Immutable by Contract: Because Flyweights are shared across concurrent threads, their internal state must never mutate."
          ],
          codeSnippet: {
            title: "High-Performance Forest Simulator in Java 21",
            code: `// The Flyweight (Immutable, Intrinsic State)
public record TreeType(String name, String color, byte[] heavy3dMesh) {
    public void draw(int x, int y, double windSpeed) {
        // Extrinsic state passed dynamically as arguments
        System.out.printf("Rendering %s at (%d, %d) with wind: %.1f%n", name, x, y, windSpeed);
    }
}

// Flyweight Factory
public class TreeTypeFactory {
    private static final Map<String, TreeType> cache = new HashMap<>();

    public static TreeType getTreeType(String name, String color) {
        String key = name + "_" + color;
        return cache.computeIfAbsent(key, k -> {
            byte[] mesh = new byte[1024 * 1024]; // 1 MB heavy asset
            return new TreeType(name, color, mesh);
        });
    }
}

// Context Object (Stores tiny Extrinsic State + Flyweight Pointer)
public record Tree(int x, int y, TreeType type) {
    public void render(double wind) {
        type.draw(x, y, wind);
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/flyweight-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Flyweight Pattern",
          pros: "Saves massive amounts of heap memory; prevents JVM GC thrashing and Out-Of-Memory crashes.",
          cons: "Trades RAM for CPU cycles (calculating extrinsic state on the fly); more complex architecture.",
          bestFor: "Game particle systems, UI text rendering engines, caching financial market order books."
        },
        {
          option: "Standard Fat Objects",
          pros: "Simple, highly self-contained objects; state and logic are bundled together.",
          cons: "Devours memory when scaling to millions of active instances.",
          bestFor: "Domain models with small instance counts (< 10,000)."
        }
      ],
      interviewTip: "In interviews, cite `Integer.valueOf(int)` as Java's built-in Flyweight: Java pre-allocates and caches `Integer` objects from -128 to 127 in memory. Calling `Integer.valueOf(5) == Integer.valueOf(5)` returns `true` because they point to the exact same shared Flyweight instance."
    },
    {
      id: "proxy",
      subtopicNumber: "2.7",
      title: "Proxy Pattern",
      subtitle: "Provides a placeholder or surrogate for another object to control access to it.",
      readingTime: "7 min read",
      difficulty: "Intermediate",
      accent: "#ef4444",
      keyTakeaways: [
        "Provides an identical interface to the target service while intercepting method calls to perform auxiliary concerns: lazy initialization, caching, access control, or remote networking.",
        "Canonical variants: Virtual Proxy (lazy loading), Protection Proxy (authorization), Remote Proxy (gRPC/RMI stubs), and Caching Proxy.",
        "Forms the foundational bedrock of Spring `@Transactional`, Hibernate lazy loading collections, and dynamic mock libraries (Mockito)."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                          PROXY UML CLASS MODEL                          |
+-------------------------------------------------------------------------+
                       +-----------------------------+
                       |        <<interface>>        |
                       |       DatabaseService       |
                       +-----------------------------+
                       | + query(sql): List<Record>  |
                       +--------------^--------------+
                                      |
              +-----------------------+-----------------------+
              |                                               |
+-------------+---------------+               +---------------+-------------+
|    RealDatabaseService      |               |     CachingSecurityProxy    |
+-----------------------------+               +-----------------------------+
| + query(sql): [Heavy Disk]  |               | - realService: DbService    |
+-----------------------------+               | - cache: Map<String, Cache> |
                                              | + query(sql): auth & cache  |
                                              +---------------+-------------+
                                                              | delegates
                                                              +-------> Real`,
      blockNodes: [
        { x: 300, y: 100, w: 260, h: 130, stereotype: 'interface', title: 'VideoDownloader', stroke: '#ef4444', lines: ['+ getVideo(id: String): byte[]'], tag: 'Subject Interface' },
        { x: 100, y: 300, w: 260, h: 140, stereotype: 'real-subject', title: 'YouTubeRealService', stroke: '#38bdf8', lines: ['- networkBandwidth: 1Gbps', '+ getVideo(id): download 4K video from YouTube API'], tag: 'Real Subject' },
        { x: 540, y: 300, w: 280, h: 150, stereotype: 'proxy', title: 'CachingAuthProxy', stroke: '#10b981', lines: ['- realService: YouTubeRealService', '- cache: ConcurrentHashMap', '+ getVideo(id): check ACL & Cache'], tag: 'Proxy' }
      ],
      blockConns: [
        { d: 'M 230 300 L 380 230', lx: 290, ly: 255, label: 'implements' },
        { d: 'M 680 300 L 510 230', lx: 615, ly: 255, label: 'implements' },
        { d: 'M 540 370 L 360 370', lx: 450, ly: 355, label: 'controls access to' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'Client Invocation', stroke: '#ef4444', lines: ['Client calls proxy.getVideo()', 'Transparent to caller', 'Client believes it is RealService'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Security Check', stroke: '#f59e0b', lines: ['Proxy validates user JWT token', 'Checks DRM rights', 'Rejects unauthorized callers'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'In-Memory Cache', stroke: '#10b981', lines: ['Checks memory cache for video', 'Cache hit: returns in 1ms', 'Bypasses YouTube download'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Lazy Real Call', stroke: '#38bdf8', lines: ['Cache miss: delegates to Real', 'Saves response to cache', 'Returns byte array to client'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'authorize' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'check cache' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'fetch & cache' }
      ],
      sections: [
        {
          heading: "Controlling Access, Lazy Loading, and Framework Interceptors",
          body: "Direct access to heavyweight resources (database connections, remote RPC servers, large video binaries) is dangerous without rate limiting, authorization, and caching. The Proxy pattern wraps the real service behind the exact same interface, intercepting requests to perform lifecycle management before and after delegating to the target object.",
          bullets: [
            "Virtual Proxy: Defers the creation of expensive objects until the exact moment a method is invoked (e.g. Hibernate lazy loading of database child tables).",
            "Protection Proxy: Verifies authorization credentials and security privileges prior to forwarding calls.",
            "Open/Closed Principle: You can introduce caching, metric logging, and access control without modifying the actual service."
          ],
          codeSnippet: {
            title: "Production Caching & Lazy-Loading Proxy in Java 21",
            code: `public interface VideoService {
    byte[] fetchVideo(String videoId);
}

// Heavy Real Service
public class HeavyVideoService implements VideoService {
    public HeavyVideoService() {
        System.out.println("Initializing expensive cloud connection...");
    }
    @Override public byte[] fetchVideo(String videoId) {
        System.out.println("Downloading 500MB from S3: " + videoId);
        return new byte[]{0x1, 0x2, 0x3};
    }
}

// The Proxy
public class CachingVideoProxy implements VideoService {
    private VideoService realService; // Lazy-loaded reference
    private final Map<String, byte[]> cache = new ConcurrentHashMap<>();

    @Override
    public byte[] fetchVideo(String videoId) {
        // Fast-path: In-memory cache hit
        byte[] cached = cache.get(videoId);
        if (cached != null) {
            System.out.println("Returning cached video for: " + videoId);
            return cached;
        }

        // Lazy initialization of heavy real service
        if (realService == null) {
            realService = new HeavyVideoService();
        }

        byte[] video = realService.fetchVideo(videoId);
        cache.put(videoId, video);
        return video;
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/proxy-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Proxy Pattern",
          pros: "Manages heavy object lifecycles; enables transparent security, caching, and lazy loading.",
          cons: "Introduces response latency for interceptor checks; multiple proxy layers can obscure debugging.",
          bestFor: "Hibernate entity lazy loading, Spring AOP transaction interceptors, RPC network stubs."
        },
        {
          option: "Direct Object Access",
          pros: "Maximum direct execution speed with zero wrapper overhead.",
          cons: "Eager initialization wastes memory; zero centralized enforcement of security or caching policies.",
          bestFor: "Lightweight local utility classes and pure value records."
        }
      ],
      interviewTip: "Distinguish Proxy from Decorator: Although both wrap an object and implement the same interface, their INTENT is fundamentally different. Decorator enhances or adds new behaviors; Proxy controls access to the underlying object (managing its lifecycle, access permissions, or network communication)."
    }
  ]
};

module.exports = { STRUCTURAL_PATTERNS };
