 

const CREATIONAL_PATTERNS = {
  id: "creational-patterns",
  topicNumber: 1,
  title: "1. Creational Patterns",
  description: "Object creation mechanisms that increase flexibility and reuse of existing code: Factory Method, Abstract Factory, Builder, Prototype, and Singleton.",
  subtopics: [
    {
      id: "factory-method",
      subtopicNumber: "1.1",
      title: "Factory Method Pattern",
      subtitle: "Defines an interface for creating an object, but lets subclasses decide which class to instantiate.",
      readingTime: "7 min read",
      difficulty: "Foundational",
      accent: "#38bdf8",
      keyTakeaways: [
        "Factory Method delegates object creation to derived subclasses, completely decoupling high-level business logic from concrete product classes.",
        "Adheres strictly to the Open/Closed Principle: you can introduce new concrete product types into the program without breaking existing client code.",
        "Eliminates tightly-coupled 'new' keyword instantiations sprinkled across your business services."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                      FACTORY METHOD UML CLASS MODEL                     |
+-------------------------------------------------------------------------+
         +-----------------------+              +-----------------------+
         |   <<abstract>>        |              |     <<interface>>     |
         |   Dialog (Creator)    |  creates ->  |   Button (Product)    |
         +-----------------------+              +-----------------------+
         | + render(): void      |              | + onClick(): void     |
         | # createButton(): Btn |              | + render(): void      |
         +-----------^-----------+              +-----------^-----------+
                     |                                      |
         +-----------+-----------+              +-----------+-----------+
         |                       |              |                       |
+--------+--------+     +--------+--------+    +--------+--------+     +--------+--------+
| WindowsDialog   |     | WebDialog       |    | WindowsButton   |     | HTMLButton      |
+-----------------+     +-----------------+    +-----------------+     +-----------------+
| # createButton()|     | # createButton()|    | + onClick()     |     | + onClick()     |
+-----------------+     +-----------------+    +-----------------+     +-----------------+`,
      blockNodes: [
        { x: 50, y: 110, w: 220, h: 140, stereotype: 'creator', title: 'Dialog (Abstract)', stroke: '#38bdf8', lines: ['+ render(): void', '# createButton(): Button'], tag: 'Creator' },
        { x: 50, y: 310, w: 220, h: 120, stereotype: 'concrete', title: 'WindowsDialog', stroke: '#38bdf8', lines: ['# createButton(): Button', '  -> return new WinButton()'], tag: 'ConcreteCreator' },
        { x: 550, y: 110, w: 220, h: 140, stereotype: 'interface', title: 'Button (Product)', stroke: '#10b981', lines: ['+ render(): void', '+ onClick(): void'], tag: 'Product' },
        { x: 550, y: 310, w: 220, h: 120, stereotype: 'concrete', title: 'WindowsButton', stroke: '#10b981', lines: ['+ render(): [Win API]', '+ onClick(): [Win Event]'], tag: 'ConcreteProduct' }
      ],
      blockConns: [
        { d: 'M 160 310 L 160 250', lx: 160, ly: 280, label: 'extends' },
        { d: 'M 270 170 L 550 170', lx: 410, ly: 160, label: 'creates / uses' },
        { d: 'M 660 310 L 660 250', lx: 660, ly: 280, label: 'implements' },
        { d: 'M 270 370 L 550 370', lx: 410, ly: 360, label: 'instantiates', dashed: true }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'Client Invocation', stroke: '#38bdf8', lines: ['Client calls dialog.render()', 'Agnostic to OS platform', 'Pure business logic layer'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Virtual Factory Call', stroke: '#f59e0b', lines: ['dialog invokes createButton()', 'Polymorphic dispatch triggers', 'Subclass hook executed'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'Concrete Instance', stroke: '#10b981', lines: ['WindowsDialog yields WinButton', 'WebDialog yields HTMLButton', 'Returned as Button interface'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Render Execution', stroke: '#a855f7', lines: ['button.render() is invoked', 'Native hooks configured', 'Zero coupling to client'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'call' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'instantiate' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'render' }
      ],
      sections: [
        {
          heading: "Architectural Intent and Separation of Concerns",
          body: "The Factory Method pattern resolves the fundamental design tension where a framework or service needs to standardize the workflow of object interactions without committing to the concrete implementations of those objects. Rather than instantiating dependencies with direct constructor invocations, the creator class delegates the instantiation responsibility to an abstract or virtual method.",
          bullets: [
            "Decouples Creator from Concrete Products: The base creator works exclusively with high-level abstract product interfaces.",
            "Single Responsibility Principle: Isolates product creation code into a single location in the codebase, simplifying maintenance.",
            "Open/Closed Principle: Introduce new products and creators without editing existing client or core framework classes."
          ],
          codeSnippet: {
            title: "Java 21 Factory Method Implementation",
            code: `// Product Interface
public interface Button {
    void render();
    void onClick();
}

// Concrete Products
public record WindowsButton() implements Button {
    @Override public void render() { System.out.println("Rendering Windows Native Button"); }
    @Override public void onClick() { System.out.println("Windows Click Event Handled"); }
}

public record HtmlButton() implements Button {
    @Override public void render() { System.out.println("<button class='btn'>Submit</button>"); }
    @Override public void onClick() { System.out.println("DOM Click Event Dispatched"); }
}

// Creator Abstract Class
public abstract class Dialog {
    public void renderWindow() {
        // High-level business logic
        Button okButton = createButton();
        okButton.render();
    }
    // The Factory Method
    protected abstract Button createButton();
}

// Concrete Creators
public class WindowsDialog extends Dialog {
    @Override protected Button createButton() { return new WindowsButton(); }
}

public class HtmlDialog extends Dialog {
    @Override protected Button createButton() { return new HtmlButton(); }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/factory-method-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Factory Method",
          pros: "Avoids tight coupling between creator and concrete products; enables Open/Closed extension.",
          cons: "Requires creating many subclasses just to create one particular object type.",
          bestFor: "Frameworks, extensible plugin architectures, and systems where object types vary dynamically."
        },
        {
          option: "Direct Constructor ('new')",
          pros: "Simplest possible code, zero boilerplate classes, direct compiler checks.",
          cons: "Violates Dependency Inversion; client code becomes hard-coded to concrete implementations.",
          bestFor: "Simple Value Objects (DTOs, records) with invariant structures and zero polymorphic behavior."
        }
      ],
      interviewTip: "In Staff-level system design and architecture interviews, distinguish between Simple Factory (a static helper method with switch statements) and Gang of Four Factory Method (polymorphic subclass inheritance where the subclass decides instantiation). Point out how Factory Method eliminates switch-case code smells."
    },
    {
      id: "abstract-factory",
      subtopicNumber: "1.2",
      title: "Abstract Factory Pattern",
      subtitle: "Provides an interface for creating families of related or dependent objects without specifying their concrete classes.",
      readingTime: "8 min read",
      difficulty: "Intermediate",
      accent: "#a855f7",
      keyTakeaways: [
        "Abstract Factory provides an interface for producing whole families of distinct, matching objects without binding client code to concrete implementations.",
        "Guarantees that products created by a factory are 100% compatible with each other (e.g., Mac Button with Mac Checkbox, Windows Button with Windows Checkbox).",
        "Encapsulates UI component libraries, multi-cloud SDK wrappers (AWS vs GCP vs Azure), and database driver abstraction layers."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                    ABSTRACT FACTORY UML CLASS MODEL                     |
+-------------------------------------------------------------------------+
                    +-----------------------------+
                    |        <<interface>>        |
                    |         GUIFactory          |
                    +-----------------------------+
                    | + createButton(): Button    |
                    | + createCheckbox(): Checkbox|
                    +--------------^--------------+
                                   |
            +----------------------+----------------------+
            |                                             |
+-----------+-----------+                     +-----------+-----------+
|      WinFactory       |                     |       MacFactory      |
+-----------------------+                     +-----------------------+
| + createButton(): Win |                     | + createButton(): Mac |
| + createCheckbox():Win|                     | + createCheckbox():Mac|
+-----------------------+                     +-----------------------+`,
      blockNodes: [
        { x: 300, y: 100, w: 260, h: 140, stereotype: 'factory-interface', title: 'GUIFactory', stroke: '#a855f7', lines: ['+ createButton(): Button', '+ createCheckbox(): Checkbox'], tag: 'AbstractFactory' },
        { x: 100, y: 310, w: 240, h: 130, stereotype: 'concrete-factory', title: 'WinFactory', stroke: '#38bdf8', lines: ['+ createButton(): WinBtn', '+ createCheckbox(): WinBox'], tag: 'Family A' },
        { x: 520, y: 310, w: 240, h: 130, stereotype: 'concrete-factory', title: 'MacFactory', stroke: '#10b981', lines: ['+ createButton(): MacBtn', '+ createCheckbox(): MacBox'], tag: 'Family B' }
      ],
      blockConns: [
        { d: 'M 220 310 L 350 240', lx: 260, ly: 260, label: 'implements' },
        { d: 'M 640 310 L 510 240', lx: 590, ly: 260, label: 'implements' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'Environment Probe', stroke: '#a855f7', lines: ['App reads OS / config', 'Selects factory instance', 'WinFactory or MacFactory'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Client Component Init', stroke: '#38bdf8', lines: ['Client calls factory.createBtn()', 'Client calls factory.createBox()', 'Receives abstract interfaces'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'Coordinated Products', stroke: '#10b981', lines: ['All products belong to family', 'Guaranteed styling consistency', 'Zero mismatch between widgets'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Client Execution', stroke: '#f59e0b', lines: ['Renders whole UI tree', 'Clean separation of platform', 'Swap theme with 1 factory change'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'bootstrap' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'produce' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'render' }
      ],
      sections: [
        {
          heading: "Decoupling Product Families from Consumer Code",
          body: "When an application needs to operate across disparate runtime platforms or database engines, using standalone Factory Methods risks combining mismatched products (for example, attempting to combine a Linux window frame with a Windows scrollbar). Abstract Factory groups product interfaces into cohesive families, ensuring complete type safety across all created artifacts.",
          bullets: [
            "Guaranteed Product Consistency: Cross-product compatibility is enforced at compile time.",
            "Loose Coupling: The client application never references WindowsButton or MacButton directly.",
            "Open/Closed Principle: Adding a new platform family (e.g. LinuxFactory) requires no modification to existing application orchestration code."
          ],
          codeSnippet: {
            title: "Multi-Cloud Storage & Compute Abstract Factory in Java 21",
            code: `public interface CloudStorage { void upload(byte[] data, String key); }
public interface CloudCompute { void spawnInstance(String vmSize); }

// Abstract Factory
public interface CloudProviderFactory {
    CloudStorage createStorage();
    CloudCompute createCompute();
}

// Concrete Family: AWS
public class AwsFactory implements CloudProviderFactory {
    @Override public CloudStorage createStorage() { return (d, k) -> System.out.println("S3 Put: " + k); }
    @Override public CloudCompute createCompute() { return s -> System.out.println("EC2 Run: " + s); }
}

// Concrete Family: Azure
public class AzureFactory implements CloudProviderFactory {
    @Override public CloudStorage createStorage() { return (d, k) -> System.out.println("Blob Put: " + k); }
    @Override public CloudCompute createCompute() { return s -> System.out.println("Azure VM Run: " + s); }
}

// Orchestrator Client
public class CloudDeployer {
    private final CloudStorage storage;
    private final CloudCompute compute;

    public CloudDeployer(CloudProviderFactory factory) {
        this.storage = factory.createStorage();
        this.compute = factory.createCompute();
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/abstract-factory-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Abstract Factory",
          pros: "Guarantees family consistency, centralizes platform creation, enforces dependency inversion.",
          cons: "High initial complexity: introducing a brand-new product interface requires changing all factory subclasses.",
          bestFor: "Multi-cloud toolkits, cross-platform UI frameworks, database connector suites."
        },
        {
          option: "Ad-hoc Dependency Injection",
          pros: "Flexible, can inject independent components without grouping them into a rigid factory hierarchy.",
          cons: "Risk of configuring incompatible cross-vendor dependencies in large distributed codebases.",
          bestFor: "Heterogeneous applications where dependencies do not form cohesive family groupings."
        }
      ],
      interviewTip: "Highlight that the Abstract Factory pattern is often implemented using a set of Factory Methods. Contrast Abstract Factory (creates families of products) with Builder (constructs a single complex object step-by-step)."
    },
    {
      id: "builder",
      subtopicNumber: "1.3",
      title: "Builder Pattern",
      subtitle: "Separates the construction of a complex object from its representation, allowing the same construction process to create various representations.",
      readingTime: "7 min read",
      difficulty: "Foundational",
      accent: "#10b981",
      keyTakeaways: [
        "Eliminates the 'Telescoping Constructor' anti-pattern where classes require constructors with 10+ overloaded parameters.",
        "Enforces object immutability by collecting configuration parameters step-by-step and validating invariants prior to final instantiation in build().",
        "Separates optional attributes from mandatory constraints while providing clean, readable fluent method chaining."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                        BUILDER UML CLASS MODEL                          |
+-------------------------------------------------------------------------+
      +------------------------+             +------------------------+
      |        Director        |             |     <<interface>>      |
      +------------------------+             |      OrderBuilder      |
      | - builder: OrderBuilder|  uses --->  +------------------------+
      +------------------------+             | + setItem(item): this  |
      | + constructVipOrder()  |             | + setCoupon(code): this|
      +------------------------+             | + build(): Order       |
                                             +-----------^------------+
                                                         |
                                             +-----------+------------+
                                             |  ConcreteOrderBuilder  |
                                             +------------------------+
                                             | - items: List<Item>    |
                                             | - coupon: String       |
                                             | + build(): Order       |
                                             +------------------------+`,
      blockNodes: [
        { x: 50, y: 130, w: 220, h: 140, stereotype: 'orchestrator', title: 'Director', stroke: '#10b981', lines: ['- builder: OrderBuilder', '+ buildVipOrder(): Order', '+ buildExpressOrder()'], tag: 'Director' },
        { x: 380, y: 110, w: 250, h: 160, stereotype: 'builder-interface', title: 'OrderBuilder', stroke: '#38bdf8', lines: ['+ withItem(id): this', '+ withDiscount(pct): this', '+ withShipping(opt): this', '+ build(): Order'], tag: 'Builder' },
        { x: 380, y: 330, w: 250, h: 130, stereotype: 'concrete-builder', title: 'StandardOrderBuilder', stroke: '#f59e0b', lines: ['- order: Order', '+ build(): Order (validated)'], tag: 'ConcreteBuilder' },
        { x: 740, y: 220, w: 200, h: 140, stereotype: 'product', title: 'Order (Immutable)', stroke: '#a855f7', lines: ['- id: UUID', '- items: List<Item>', '- totalCents: long'], tag: 'Product' }
      ],
      blockConns: [
        { d: 'M 270 200 L 380 180', lx: 325, ly: 170, label: 'directs' },
        { d: 'M 505 330 L 505 270', lx: 505, ly: 300, label: 'implements' },
        { d: 'M 630 380 L 740 300', lx: 690, ly: 340, label: 'assembles', dashed: true }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'Builder Instantiation', stroke: '#10b981', lines: ['Order.builder() initialized', 'Default options loaded', 'Mutable builder state'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Fluent Configuration', stroke: '#38bdf8', lines: ['.addItem("SKU-100")', '.withExpressShipping()', '.withCoupon("SPRING26")'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'Invariant Validation', stroke: '#f59e0b', lines: ['.build() validates fields', 'Ensures shipping address exists', 'Rejects negative prices'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Immutable Delivery', stroke: '#a855f7', lines: ['Yields frozen Order record', 'Thread-safe and unmodifiable', 'Ready for DB persistence'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'chain' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'validate' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'freeze' }
      ],
      sections: [
        {
          heading: "Preventing Telescoping Constructors and Mutation Bugs",
          body: "As domain entities accumulate dozens of optional settings, constructors become unmaintainable (e.g. `new HttpRequest(url, headers, timeout, retry, proxy, cookieJar, null, null, false)`). Passing multiple boolean and null arguments introduces severe caller bugs. The Builder pattern isolates configuration assembly, enforces required parameters, and produces an immutable target instance.",
          bullets: [
            "Fluent API: Self-documenting, chained method invocations improve code readability across engineering teams.",
            "Fail-Fast Invariant Checking: All business constraint validations run atomically inside the build() method prior to object creation.",
            "Thread Safety: The constructed entity can have only private final fields and no setters, making it inherently thread-safe."
          ],
          codeSnippet: {
            title: "Production Java 21 Builder with Fail-Fast Invariant Checks",
            code: `public final class HttpRequest {
    private final String url;
    private final Duration timeout;
    private final boolean followRedirects;
    private final Map<String, String> headers;

    private HttpRequest(Builder builder) {
        this.url = builder.url;
        this.timeout = builder.timeout;
        this.followRedirects = builder.followRedirects;
        this.headers = Map.copyOf(builder.headers); // Defensive copy
    }

    public static Builder newBuilder(String url) { return new Builder(url); }

    public static class Builder {
        private final String url; // Mandatory
        private Duration timeout = Duration.ofSeconds(5); // Default
        private boolean followRedirects = true;
        private final Map<String, String> headers = new HashMap<>();

        public Builder(String url) {
            Objects.requireNonNull(url, "URL cannot be null");
            this.url = url;
        }

        public Builder timeout(Duration timeout) {
            if (timeout.isNegative()) throw new IllegalArgumentException("Timeout cannot be negative");
            this.timeout = timeout;
            return this;
        }

        public Builder header(String key, String value) {
            headers.put(key, value);
            return this;
        }

        public HttpRequest build() {
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                throw new IllegalStateException("URL must use HTTP or HTTPS protocol");
            }
            return new HttpRequest(this);
        }
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/builder-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Builder Pattern",
          pros: "Provides fluent readable code, supports partial construction, enables immutable target objects.",
          cons: "Requires duplicating all domain fields in the builder class; higher boilerplate overhead.",
          bestFor: "Complex domain entities, HTTP/gRPC client configurations, SQL/query generators."
        },
        {
          option: "Java Record / POJO Setters",
          pros: "Compact syntax (records), simple bean reflection support (frameworks like Jackson/Spring).",
          cons: "Setters expose mutable state causing concurrent race conditions; records with 10+ fields are hard to read at call sites.",
          bestFor: "Small DTOs with 2-4 fields, simple data mapping payloads."
        }
      ],
      interviewTip: "In interviews, emphasize how Builder enables Immutability. Explain that in multi-threaded environments, an immutable object constructed via a Builder eliminates the need for synchronization locks."
    },
    {
      id: "prototype",
      subtopicNumber: "1.4",
      title: "Prototype Pattern",
      subtitle: "Specifies the kinds of objects to create using a prototypical instance, and creates new objects by copying this prototype.",
      readingTime: "6 min read",
      difficulty: "Intermediate",
      accent: "#f59e0b",
      keyTakeaways: [
        "Creates new objects by cloning an existing configured instance, bypassing expensive constructor calls or external database lookups.",
        "Crucial for high-throughput systems where object construction involves heavy initialization (e.g., parsing XML, loading AI weight matrices, fetching schema metadata).",
        "Requires deep attention to Deep Copy vs Shallow Copy semantics to prevent shared mutable state bugs."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                        PROTOTYPE UML CLASS MODEL                        |
+-------------------------------------------------------------------------+
                  +--------------------------------+
                  |         <<interface>>          |
                  |           Prototype            |
                  +--------------------------------+
                  | + clone(): Prototype           |
                  +---------------^----------------+
                                  |
              +-------------------+-------------------+
              |                                       |
+-------------+--------------+          +-------------+--------------+
|       NetworkPacket        |          |      DocumentTemplate      |
+----------------------------+          +----------------------------+
| - payload: byte[]          |          | - styles: Map<String,Style>|
| + clone(): NetworkPacket   |          | + clone(): DocumentTemplate|
+----------------------------+          +----------------------------+`,
      blockNodes: [
        { x: 340, y: 110, w: 260, h: 140, stereotype: 'interface', title: 'Prototype<T>', stroke: '#f59e0b', lines: ['+ clone(): T'], tag: 'Prototype' },
        { x: 120, y: 310, w: 260, h: 140, stereotype: 'concrete-prototype', title: 'NetworkPacket', stroke: '#38bdf8', lines: ['- header: byte[]', '- body: byte[]', '+ clone(): Deep Copy'], tag: 'Cloneable A' },
        { x: 560, y: 310, w: 260, h: 140, stereotype: 'concrete-prototype', title: 'DocumentTemplate', stroke: '#10b981', lines: ['- metadata: Config', '- layout: AST', '+ clone(): Deep Copy'], tag: 'Cloneable B' }
      ],
      blockConns: [
        { d: 'M 250 310 L 390 250', lx: 310, ly: 275, label: 'implements' },
        { d: 'M 690 310 L 550 250', lx: 630, ly: 275, label: 'implements' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'Master Template Loaded', stroke: '#f59e0b', lines: ['Heavy resource parsed', 'Metadata cached in memory', 'Acts as registry prototype'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Clone Request', stroke: '#38bdf8', lines: ['Client calls proto.clone()', 'Direct memory / field copy', 'Bypasses DB / network fetch'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'Deep Copy Isolation', stroke: '#10b981', lines: ['Clones nested collections', 'Allocates independent memory', 'Zero cross-talk contamination'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Customized Instance', stroke: '#a855f7', lines: ['Client mutates cloned fields', 'Dispatched to worker threads', '100x faster than re-creating'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'clone()' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'deep-copy' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'customize' }
      ],
      sections: [
        {
          heading: "High-Performance Object Replication and Deep Copy Safety",
          body: "When object initialization involves disk I/O, database queries, or expensive mathematical calculations, repeating that work on every request degrades throughput. The Prototype pattern stores pre-configured instances in an in-memory Prototype Registry. New instances are created by cloning the pre-computed prototype in milliseconds.",
          bullets: [
            "Bypasses Constructor Penalties: Instant memory allocation without re-running compute-heavy initialization routines.",
            "Dynamic Runtime Composition: You can add and remove prototype templates at runtime without code redeployment.",
            "Deep Copy Requirement: Never use shallow clones for mutable reference types; always recursively clone child arrays and objects."
          ],
          codeSnippet: {
            title: "Thread-Safe Prototype Registry in Java 21",
            code: `public interface Prototype<T> {
    T clone();
}

public record ServerConfig(String os, int port, List<String> flags) implements Prototype<ServerConfig> {
    @Override
    public ServerConfig clone() {
        // Deep copy of mutable list
        return new ServerConfig(this.os, this.port, new ArrayList<>(this.flags));
    }
}

public class PrototypeRegistry {
    private final Map<String, Prototype<?>> registry = new ConcurrentHashMap<>();

    public void register(String key, Prototype<?> prototype) {
        registry.put(key, prototype);
    }

    @SuppressWarnings("unchecked")
    public <T> T createFromPrototype(String key) {
        Prototype<?> p = registry.get(key);
        if (p == null) throw new NoSuchElementException("Prototype not found: " + key);
        return (T) p.clone();
    }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/prototype-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Prototype Pattern",
          pros: "Massive speedup for expensive-to-initialize objects; dynamic configuration caching.",
          cons: "Cloning complex objects with circular references is notoriously difficult to implement bug-free.",
          bestFor: "Game development (spawning entities), simulation engines, database query AST cloning."
        },
        {
          option: "Factory Re-Instantiation",
          pros: "Guarantees freshly minted objects from scratch; simple logic without deep-copy headaches.",
          cons: "Incurs full initialization latency, I/O cost, and database roundtrips repeatedly.",
          bestFor: "Lightweight objects whose constructors execute in nanoseconds."
        }
      ],
      interviewTip: "Be ready to explain the difference between Shallow Copy (copying references so both objects point to the same memory buffer) and Deep Copy (allocating new memory and recursively copying all data structures). Mention Java's Cloneable interface flaws and why copy constructors are preferred in modern Java."
    },
    {
      id: "singleton",
      subtopicNumber: "1.5",
      title: "Singleton Pattern",
      subtitle: "Ensures that a class has only one instance, while providing a global access point to this instance.",
      readingTime: "7 min read",
      difficulty: "Foundational",
      accent: "#ef4444",
      keyTakeaways: [
        "Guarantees that a class has exactly one runtime instance in the JVM / process and provides a global access point.",
        "Must be implemented with Double-Checked Locking with a volatile variable, Bill Pugh Lazy Holder, or an Enum to prevent multi-threaded race conditions.",
        "Overuse creates hidden global state, tightly couples components, and severely impairs unit test mockability."
      ],
      ascii: `+-------------------------------------------------------------------------+
|                        SINGLETON UML CLASS MODEL                        |
+-------------------------------------------------------------------------+
                   +------------------------------------+
                   |             Singleton              |
                   +------------------------------------+
                   | - instance: Singleton {static}     |
                   | - state: ConnectionPool            |
                   +------------------------------------+
                   | - Singleton()                      |
                   | + getInstance(): Singleton {static}|
                   | + query(sql): ResultSet           |
                   +------------------------------------+
                                      |
                     [Client 1] [Client 2] [Client 3]
                     (All share the exact same reference)`,
      blockNodes: [
        { x: 300, y: 110, w: 340, h: 200, stereotype: 'singleton', title: 'ConnectionPool (Singleton)', stroke: '#ef4444', lines: ['- instance: ConnectionPool {volatile, static}', '- pool: BlockingQueue<Connection>', '- ConnectionPool() {private}', '+ getInstance(): ConnectionPool {static}', '+ getConnection(): Connection'], tag: 'Singleton Instance' },
        { x: 80, y: 360, w: 200, h: 100, stereotype: 'client', title: 'Worker Thread 1', stroke: '#38bdf8', lines: ['getInstance() reference'], tag: 'Client' },
        { x: 370, y: 360, w: 200, h: 100, stereotype: 'client', title: 'Worker Thread 2', stroke: '#10b981', lines: ['getInstance() reference'], tag: 'Client' },
        { x: 660, y: 360, w: 200, h: 100, stereotype: 'client', title: 'Worker Thread 3', stroke: '#f59e0b', lines: ['getInstance() reference'], tag: 'Client' }
      ],
      blockConns: [
        { d: 'M 180 360 L 370 310', lx: 260, ly: 330, label: 'shared ref' },
        { d: 'M 470 360 L 470 310', lx: 470, ly: 335, label: 'shared ref' },
        { d: 'M 760 360 L 570 310', lx: 680, ly: 330, label: 'shared ref' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'First Access', stroke: '#ef4444', lines: ['Thread A calls getInstance()', 'Instance check returns null', 'Enters synchronized block'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Volatile Lock Check', stroke: '#f59e0b', lines: ['Second check confirms null', 'Allocates heap memory', 'Initializes hardware pool'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'Memory Fence', stroke: '#10b981', lines: ['Volatile write commits', 'Prevents instruction reordering', 'Publish instance safely'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Concurrent Reads', stroke: '#38bdf8', lines: ['Threads B and C read instance', 'Zero synchronization lock lag', 'Instant memory return'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'lock' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'publish' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'read' }
      ],
      sections: [
        {
          heading: "Concurrency Pitfalls, Instruction Reordering, and Idiomatic Implementations",
          body: "The naïve Singleton implementation is vulnerable to race conditions under multi-core CPUs. If two threads check `if (instance == null)` concurrently, both create new instances. Furthermore, due to compiler and CPU out-of-order instruction execution, a thread might see a non-null instance before its fields have finished constructor initialization. Modern Java uses the Bill Pugh Holder idiom or Enum singleton to guarantee thread safety via JVM ClassLoader mechanics.",
          bullets: [
            "Why Volatile is Required: In double-checked locking, `volatile` introduces a CPU memory barrier (fence), preventing the reordering of object allocation and constructor assignment.",
            "Bill Pugh Lazy Initialization: An inner static helper class is not loaded into memory until `getInstance()` is called, achieving lazy loading with zero synchronization overhead.",
            "Effective Java Enum Singleton: Joshua Bloch's canonical approach: 100% immune to serialization attacks and reflection instantiation hacks."
          ],
          codeSnippet: {
            title: "Three Thread-Safe Singleton Idioms in Java 21",
            code: `// Idiom 1: Double-Checked Locking (DCL)
public final class DclSingleton {
    private static volatile DclSingleton instance;
    private DclSingleton() {}

    public static DclSingleton getInstance() {
        DclSingleton result = instance;
        if (result == null) {
            synchronized (DclSingleton.class) {
                result = instance;
                if (result == null) {
                    instance = result = new DclSingleton();
                }
            }
        }
        return result;
    }
}

// Idiom 2: Bill Pugh Initialization-on-demand Holder (Recommended)
public final class BillPughSingleton {
    private BillPughSingleton() {}
    private static class Holder {
        private static final BillPughSingleton INSTANCE = new BillPughSingleton();
    }
    public static BillPughSingleton getInstance() {
        return Holder.INSTANCE;
    }
}

// Idiom 3: Enum Singleton (Zero Reflection / Serialization Vulnerability)
public enum EnumSingleton {
    INSTANCE;
    public void executeQuery(String sql) { System.out.println("Executing: " + sql); }
}`
          },
          flowDiagramUrl: "/diagrams/design-patterns/singleton-flow.svg"
        }
      ],
      tradeOffs: [
        {
          option: "Bill Pugh Holder / Enum Singleton",
          pros: "Guaranteed thread-safety, lazy loading without lock contention, immune to race conditions.",
          cons: "Global access introduces hidden dependencies; tight coupling makes unit tests difficult.",
          bestFor: "Hardware drivers, central thread pool coordinators, metrics collectors."
        },
        {
          option: "Dependency Injection Container (Spring / Guice)",
          pros: "Singleton lifecycle managed at container level; classes remain testable and injectable via interfaces.",
          cons: "Requires an application context framework runtime.",
          bestFor: "All modern enterprise web applications and microservice backends."
        }
      ],
      interviewTip: "In interviews, explain WHY `volatile` is required in Double-Checked Locking: the JVM operation `instance = new Singleton()` involves three CPU instructions: (1) allocate memory, (2) run constructor, (3) assign memory pointer to `instance`. Without `volatile`, the CPU can reorder (1)->(3)->(2), exposing an uninitialized instance to concurrent threads."
    }
  ]
};

module.exports = { CREATIONAL_PATTERNS };
