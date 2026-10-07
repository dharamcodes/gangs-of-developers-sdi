/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const STRUCTURAL_PATTERNS = {
  id: "structural-patterns",
  topicNumber: 2,
  title: "2. Structural Patterns",
  description: "Assembling objects and classes into larger, flexible structures while keeping systems efficient and decoupled: Adapter, Facade, Decorator, Proxy, Composite, Bridge, and Flyweight.",
  subtopics: [
    {
      id: "adapter",
      subtopicNumber: "2.1",
      title: "Adapter Pattern",
      subtitle: "Allows objects with incompatible interfaces to collaborate by converting the interface of a class into another interface clients expect.",
      readingTime: "8 min read",
      difficulty: "Foundational",
      accent: "#38bdf8",
      keyTakeaways: [
        "Acts as a translator wrapper between two existing, incompatible APIs or legacy interfaces.",
        "Object Adapter uses object composition (wraps Adaptee instance) rather than multiple inheritance, strictly honoring 'composition over inheritance'.",
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
          heading: "1. Architectural Intent: Bridging Legacy & Incompatible Interface Boundaries",
          body: "In production engineering, third-party libraries, vendor SDKs, and legacy internal subsystems rarely match modern internal domain interfaces. Without an adapter, vendor-specific method names, error codes, and parameters leak directly into core application business logic, locking your architecture to a specific external vendor. The Adapter pattern encapsulates third-party interactions behind a standard internal domain interface.",
          bullets: [
            "Anti-Corruption Layer (ACL): Serves as Domain-Driven Design's primary technical mechanism to isolate core domain entities from external pollution.",
            "Single Responsibility Principle: Data conversion, currency formatting, and vendor authentication logic is cleanly separated from primary business workflows.",
            "Open/Closed Principle: Swapping payment providers (e.g., Stripe to Adyen or PayPal) requires introducing a new adapter class without touching existing client code."
          ]
        },
        {
          heading: "2. Class Adapter vs Object Adapter & Delegation Mechanics",
          body: "The Gang of Four book defines two variants: Class Adapter (which uses multiple inheritance to subclass both the Target and the Adaptee) and Object Adapter (which uses object composition to hold a reference to the Adaptee). In languages like Java, C#, and TypeScript where multiple class inheritance is prohibited, Object Adapter is the standard. Furthermore, Object Adapter is architecturally superior because a single adapter instance can adapt not only the Adaptee class, but any of its subclasses.",
          bullets: [
            "Object Adapter Composition: Holds a private reference to the adaptee and delegates calls to it after parameter transformation.",
            "Polymorphic Substitution: Clients interact purely with the target interface, unaware of the underlying vendor SDK.",
            "Two-Way Adapters: In symmetric integration scenarios, a two-way adapter implements both interfaces simultaneously, allowing bidirectional communication between legacy and modern systems."
          ]
        },
        {
          heading: "3. Failure Modes: Anti-Corruption Layers vs Leaky Abstractions",
          body: "A frequent architectural trap is allowing vendor-specific exceptions or unique semantics to leak through the adapter. If an adapter method throws StripeInvalidCardException or passes raw vendor JSON strings up to the controller, the abstraction has leaked. All vendor-specific errors must be caught, categorized, and translated into canonical domain exceptions.",
          bullets: [
            "Exception Leakage: Callers should never need to import vendor SDK packages to catch exceptions thrown by an adapter.",
            "Performance Overhead: In high-frequency data pipelines, allocating intermediate adapter objects or performing deep JSON re-serialization per call can introduce GC pressure.",
            "Semantic Mismatches: When the adaptee requires concepts not present in the domain interface (e.g. multi-step asynchronous webhooks vs synchronous HTTP), forcing a synchronous adapter can cause thread exhaustion."
          ]
        },
        {
          heading: "4. Production Implementation Blueprint: High-Scale Payment Gateway Adapter in Java 21",
          body: "The following production Java implementation showcases an enterprise Payment Gateway Adapter translating between an internal domain interface and an external third-party SDK with comprehensive exception mapping.",
          bullets: [
            "PaymentProcessor Target: Clean domain contract utilizing Java currency and record types.",
            "PayPalPaymentAdapter: Encapsulates currency conversion, credential mapping, and exception translation."
          ],
          codeSnippet: {
            title: "Production Payment Gateway Adapter in Java 21",
            code: `// 1. Internal Domain Target Interface
public interface PaymentProcessor {
    PaymentResult processPayment(String customerId, long amountInCents, String idempotencyKey);
}

public record PaymentResult(boolean successful, String transactionId, String failureReason) {}

// 2. Incompatible Third-Party Vendor SDK
public class LegacyPayPalService {
    public int sendMoney(String email, double amountInDollars, String token) {
        System.out.printf("PayPal SDK: Charged $%.2f for %s%n", amountInDollars, email);
        return 200; // Legacy HTTP response code
    }
}

// 3. Robust Production Object Adapter
public class PayPalPaymentAdapter implements PaymentProcessor {
    private final LegacyPayPalService payPalService;
    private final String apiToken;

    public PayPalPaymentAdapter(LegacyPayPalService payPalService, String apiToken) {
        this.payPalService = Objects.requireNonNull(payPalService);
        this.apiToken = Objects.requireNonNull(apiToken);
    }

    @Override
    public PaymentResult processPayment(String customerId, long amountInCents, String idempotencyKey) {
        try {
            // Adapt parameters: convert integer cents to floating dollar amount
            double amountInDollars = amountInCents / 100.0;
            int responseCode = payPalService.sendMoney(customerId, amountInDollars, this.apiToken);

            if (responseCode == 200) {
                return new PaymentResult(true, "PP-" + UUID.randomUUID(), null);
            } else {
                return new PaymentResult(false, null, "Vendor error code: " + responseCode);
            }
        } catch (Exception ex) {
            // Translate vendor exception to domain outcome
            return new PaymentResult(false, null, "Gateway exception: " + ex.getMessage());
        }
    }
}`
          }
        }
      ],
      tradeOffs: [
        {
          option: "Object Adapter Pattern",
          pros: "Protects domain logic from vendor lock-in, enables seamless mocking in unit tests, supports adaptee polymorphism.",
          cons: "Adds an additional layer of method indirection and small object memory overhead.",
          bestFor: "Integrating third-party SDKs, payment gateways, cloud vendor storage services."
        },
        {
          option: "Direct SDK Invocation",
          pros: "Faster to code initially; direct access to all vendor-specific parameters.",
          cons: "Tightly couples your entire application to external APIs; replacing the SDK requires rewriting all callers.",
          bestFor: "Disposable prototypes and small internal scripts."
        },
        {
          option: "Class Adapter (Multiple Inheritance)",
          pros: "No separate delegate object needed; can override adaptee behavior directly.",
          cons: "Not supported in single-inheritance languages; binds statically to one concrete adaptee class.",
          bestFor: "C++ systems requiring fine-grained low-level method overrides."
        }
      ],
      interviewTip: "Distinguish between Object Adapter (composition based, wraps the adaptee instance) and Class Adapter (uses multiple inheritance, impossible in Java classes). Always emphasize that Object Adapter is superior because it adheres to 'composition over inheritance' and can adapt any subclass of the adaptee."
    },
    {
      id: "facade",
      subtopicNumber: "2.2",
      title: "Facade Pattern",
      subtitle: "Provides a unified, simplified interface to a complex subsystem, making the subsystem easier to use.",
      readingTime: "8 min read",
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
          heading: "1. Architectural Intent: Taming Subsystem Sprawl & Establishing Cohesive Boundaries",
          body: "As enterprise architectures grow, completing a single high-level business requirement often requires orchestrating 5 to 10 independent subsystems. Exposing this orchestration directly to UI controllers or external microservices creates massive coupling: any change in an internal subsystem class breaks all external callers. A Facade provides an intentional, ergonomic entry point while insulating consumers from lower-level churn.",
          bullets: [
            "Coarse-Grained API: Exposes high-level methods tailored to consumer business intents rather than technical implementation details.",
            "Subsystem Isolation: Changes to internal subsystem dependencies, method signatures, or data structures remain contained behind the facade.",
            "Reduced Compilation Dependencies: In large monorepos, consumers only depend on the Facade module, speeding up build and test cycles."
          ]
        },
        {
          heading: "2. Encapsulation Without Confinement: Subsystem Bypass & Layering",
          body: "A crucial distinction between Facade and patterns like Adapter or Proxy is that Facade does not hide or seal the subsystem classes. It simply offers a convenient default workflow for the 90% common use cases. Power users or specialized subsystems that require fine-grained access (e.g., custom batch fulfillment or advanced telemetry) can still bypass the Facade and interact directly with underlying subsystem classes.",
          bullets: [
            "Permeable Boundary: Does not encapsulate subsystems into private black boxes; subsystem classes remain accessible when needed.",
            "Layered Facades: Multiple facades can be constructed for different domains (e.g., MobileOrderFacade vs WarehouseFulfillmentFacade) over the same underlying subsystem classes.",
            "Coordination Orchestrator: Facades handle the order of execution, error compensation, and transaction lifecycle across subsystem components."
          ]
        },
        {
          heading: "3. Failure Modes: The God-Object Anti-Pattern & Leaky Domain Models",
          body: "When teams adopt Facades, a common failure mode is treating the Facade as a dumping ground for all cross-cutting business logic. Over time, the Facade accumulates hundreds of methods, thousands of lines of conditional code, and becomes an untestable God Object. Furthermore, if the Facade leaks internal subsystem entities in its return signatures, consumers become coupled to the subsystem anyway.",
          bullets: [
            "God Object Sprawl: When a single facade orchestrates too many disparate domains, break it down into multiple domain-specific facades.",
            "Leaky Return Types: Facade methods should return clean DTOs or value objects rather than raw internal subsystem entity models.",
            "Implicit Rollbacks: If Subsystem 3 fails after Subsystems 1 and 2 succeed, the Facade must orchestrate compensation steps or let a distributed transaction manager handle atomicity."
          ]
        },
        {
          heading: "4. Production Blueprint: Enterprise E-Commerce Checkout Facade in TypeScript",
          body: "The following production TypeScript implementation demonstrates an enterprise Checkout Facade coordinating inventory reservation, payment processing, and shipment dispatching with robust error compensation.",
          bullets: [
            "CheckoutFacade: Single cohesive entry point for client checkout transactions.",
            "Compensating Rollbacks: Releases inventory hold if payment authorization fails."
          ],
          codeSnippet: {
            title: "Production Checkout Facade in TypeScript",
            code: `// Subsystem 1: Inventory
export class InventoryService {
  public async reserve(sku: string, qty: number): Promise<string> {
    console.log(\`[Inventory] Reserved \${qty} units of \${sku}\`);
    return "RES-9872";
  }
  public async release(reservationId: string): Promise<void> {
    console.log(\`[Inventory] Released reservation \${reservationId}\`);
  }
}

// Subsystem 2: Payment
export class PaymentService {
  public async charge(customerId: string, amountCents: number): Promise<string> {
    console.log(\`[Payment] Charged \${amountCents} cents to \${customerId}\`);
    return "TX-55412";
  }
}

// Subsystem 3: Logistics
export class LogisticsService {
  public async scheduleShipment(sku: string, qty: number, address: string): Promise<string> {
    console.log(\`[Logistics] Scheduled dispatch to \${address}\`);
    return "TRACK-FEDEX-998";
  }
}

// The Unified Facade
export class CheckoutFacade {
  constructor(
    private readonly inventory: InventoryService,
    private readonly payment: PaymentService,
    private readonly logistics: LogisticsService
  ) {}

  public async placeOrder(
    customerId: string,
    sku: string,
    qty: number,
    amountCents: number,
    address: string
  ): Promise<{ success: boolean; orderId?: string; error?: string }> {
    let reservationId: string | null = null;
    try {
      // Step 1: Reserve Stock
      reservationId = await this.inventory.reserve(sku, qty);

      // Step 2: Authorize Payment
      const paymentTx = await this.payment.charge(customerId, amountCents);

      // Step 3: Schedule Logistics
      const trackingNumber = await this.logistics.scheduleShipment(sku, qty, address);

      const orderId = \`ORD-\${Date.now()}\`;
      return { success: true, orderId };
    } catch (err: any) {
      // Compensating action: Rollback inventory reservation
      if (reservationId) {
        await this.inventory.release(reservationId);
      }
      return { success: false, error: err.message };
    }
  }
}`
          }
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
          bestFor: "Specialized internal tools where clients genuinely need low-level customization of every single parameter."
        },
        {
          option: "Mediator Pattern",
          pros: "Decouples subsystem classes from each other by centralizing their mutual communication.",
          cons: "Subsystem classes must know about the Mediator, creating bidirectional dependencies.",
          bestFor: "GUI component frameworks where sibling widgets must react to each other's state changes."
        }
      ],
      interviewTip: "Emphasize to interviewers that a Facade provides an *optional* simplified interface; it does not hide or seal the subsystem classes. Contrast Facade with Adapter: Adapter adapts one existing interface to another; Facade creates a completely new, simplified interface over multiple subsystems."
    },
    {
      id: "decorator",
      subtopicNumber: "2.3",
      title: "Decorator Pattern",
      subtitle: "Attaches additional responsibilities to an object dynamically, providing a flexible alternative to subclassing for extending functionality.",
      readingTime: "9 min read",
      difficulty: "Intermediate",
      accent: "#f59e0b",
      keyTakeaways: [
        "Adds behavior to individual objects dynamically at runtime without affecting other instances of the same class.",
        "Follows the Open/Closed Principle: extend functionality via wrapper layers without modifying existing classes.",
        "Found throughout Java I/O (`new BufferedReader(new InputStreamReader(fileStream))`) and HTTP middleware filter chains."
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
          heading: "1. Architectural Intent: Dynamic Composition Over Static Class Inheritance",
          body: "Subclassing creates rigid compile-time behavior: if you have a Logger, and you need TimestampLogging, FileLogging, and SlackLogging, creating subclasses for all permutations requires TimestampSlackLogger, TimestampFileLogger, etc. If you have N features, inheritance produces O(2^N) subclasses. Decorator replaces static subclassing with nested wrappers that can be stacked arbitrarily in any order at runtime.",
          bullets: [
            "Single Responsibility Principle: Each decorator class focuses exclusively on one orthogonal concern (caching, logging, encryption, metrics).",
            "Transparent Wrapping: Because decorators implement the exact same interface as the wrapped object, callers cannot distinguish a raw instance from a wrapped one.",
            "Dynamic Assembly: Decorator chains can be assembled conditionally based on runtime feature flags, environment configurations, or user permissions."
          ]
        },
        {
          heading: "2. Recursive Wrapper Chains & Interceptor Pipeline Mechanics",
          body: "At runtime, invoking a method on the outermost decorator initiates a recursive invocation down the wrapper chain. The outermost decorator executes its 'pre-invocation' hooks (e.g., starting a latency timer), delegates to its inner wrappee, which delegates down to the core concrete component. Once the core component returns, the invocation stack unwinds back up, allowing decorators to run 'post-invocation' hooks (e.g., logging duration or caching the return payload).",
          bullets: [
            "Concentric Shell Model: The core concrete object sits at the center, surrounded by concentric layers of decorator behaviors.",
            "Ordering Sensitivity: The order of decorator wrapping can critically alter behavior: e.g. CompressionDecorator(EncryptionDecorator(stream)) produces very different byte streams than EncryptionDecorator(CompressionDecorator(stream)).",
            "Transparent Substitution: A decorated instance satisfies all type contracts of the core component, enabling zero-touch retrofitting into existing code."
          ]
        },
        {
          heading: "3. Failure Modes: Identity Crisis (this-pointer bypass) & Decorator Ordering",
          body: "A notorious subtlety of the Decorator pattern is the 'Self-Call' or 'Identity Crisis' problem. If the core concrete object invokes another of its own internal methods (this.otherMethod()), that call executes directly on the inner instance, completely bypassing the outer decorator's interceptors! Furthermore, developers must be extremely vigilant with object equality: decorator != innerObject even though both implement the same interface.",
          bullets: [
            "Self-Invocation Bypass: Internal helper calls made via 'this' will bypass the decorator pipeline.",
            "Broken Identity: Equality checks (e.g. inner.equals(decorator)) fail unless equals() and hashCode() are deliberately forwarded down the chain.",
            "Removal Difficulty: While it is easy to wrap an object, removing an arbitrary decorator from the middle of a deeply nested chain at runtime is exceedingly difficult."
          ]
        },
        {
          heading: "4. Production Blueprint: Resilient HTTP Execution Pipeline in Java 21",
          body: "The following production Java implementation showcases an enterprise Resilient HTTP Client pipeline utilizing Decorator chains for automatic retries, latency metrics, and circuit-breaker telemetry.",
          bullets: [
            "HttpExecution Contract: Unified interface implemented by base client and all decorators.",
            "Metrics & Retry Wrappers: Composable middleware stacked at runtime without subclassing."
          ],
          codeSnippet: {
            title: "Production Resilient HTTP Pipeline in Java 21",
            code: `public interface HttpExecution {
    String send(String request);
}

// 1. Core Concrete Component
public class SimpleHttpClient implements HttpExecution {
    @Override public String send(String request) {
        return "200 OK: payload for " + request;
    }
}

// 2. Abstract Decorator Base
public abstract class HttpDecorator implements HttpExecution {
    protected final HttpExecution inner;
    protected HttpDecorator(HttpExecution inner) { 
        this.inner = Objects.requireNonNull(inner); 
    }
}

// 3. Concrete Decorator A: Latency Telemetry
public class MetricsHttpDecorator extends HttpDecorator {
    public MetricsHttpDecorator(HttpExecution inner) { super(inner); }

    @Override public String send(String request) {
        long start = System.nanoTime();
        try {
            return inner.send(request);
        } finally {
            long durationMs = (System.nanoTime() - start) / 1_000_000;
            System.out.printf("[Telemetry] Request latency: %d ms%n", durationMs);
        }
    }
}

// 4. Concrete Decorator B: Transient Fault Retries
public class RetryHttpDecorator extends HttpDecorator {
    private final int maxRetries;

    public RetryHttpDecorator(HttpExecution inner, int maxRetries) {
        super(inner);
        this.maxRetries = maxRetries;
    }

    @Override public String send(String request) {
        int attempts = 0;
        while (true) {
            try {
                attempts++;
                return inner.send(request);
            } catch (RuntimeException ex) {
                if (attempts >= maxRetries) {
                    throw ex;
                }
                System.out.printf("[Retry] Attempt %d failed. Retrying...%n", attempts);
            }
        }
    }
}`
          }
        }
      ],
      tradeOffs: [
        {
          option: "Decorator Pattern",
          pros: "High flexibility, dynamic runtime configuration, eliminates subclass combinatorial explosion.",
          cons: "Debugging deep nested wrappers with stack traces can be tricky; order of decorators matters.",
          bestFor: "Stream processing, HTTP middleware pipelines, caching & logging wrappers, UI widget overlays."
        },
        {
          option: "Subclassing / Inheritance",
          pros: "Straightforward for fixed static variations with zero runtime configuration.",
          cons: "Rigid compile-time binding; cannot combine independent behaviors without duplicating code.",
          bestFor: "Extending classes where behaviors are not composable or stackable."
        },
        {
          option: "Aspect-Oriented Programming (AOP)",
          pros: "Separates concerns declaratively via annotations (@Transactional, @Retryable) without wrapping code.",
          cons: "Requires heavy bytecode instrumentation (CGLIB/AspectJ); hard to trace execution flow statically.",
          bestFor: "Cross-cutting framework-level concerns across hundreds of business services."
        }
      ],
      interviewTip: "In interviews, cite `java.io.BufferedReader` and `java.io.InputStream` as the definitive standard library example of Decorator. Point out that Decorator differs from Proxy because Proxy *controls access* to an object without changing behavior, whereas Decorator *enhances behavior*."
    },
    {
      id: "proxy",
      subtopicNumber: "2.4",
      title: "Proxy Pattern",
      subtitle: "Provides a placeholder or surrogate for another object to control access to it.",
      readingTime: "9 min read",
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
+-------------+-------------+                   +-------------+-------------+
|    RealDatabaseService    |                   |    SecurityCachingProxy   |
+---------------------------+                   +---------------------------+
| + query(sql): List<Record>|                   | - realService: DbService  |
+---------------------------+                   | - cache: Map<String, Res> |
                                                | - userRole: Role          |
                                                +---------------------------+
                                                | + query(sql): checks auth |
                                                |   checks cache -> real    |
                                                +---------------------------+`,
      blockNodes: [
        { x: 300, y: 100, w: 260, h: 130, stereotype: 'interface', title: 'DatabaseService', stroke: '#ef4444', lines: ['+ query(sql: String): Data', '+ ping(): boolean'], tag: 'Subject Interface' },
        { x: 80, y: 300, w: 260, h: 140, stereotype: 'real', title: 'PostgresDbService', stroke: '#38bdf8', lines: ['- pool: HikariDataSource', '+ query(): executes SQL on DB', 'Cost: Heavy TCP handshake'], tag: 'Real Subject' },
        { x: 520, y: 300, w: 280, h: 160, stereotype: 'proxy', title: 'CachingSecurityProxy', stroke: '#10b981', lines: ['- real: PostgresDbService', '- cache: LruCache<Sql, Data>', '+ query(): check JWT -> cache hit?'], tag: 'Proxy Surrogate' }
      ],
      blockConns: [
        { d: 'M 210 300 L 370 230', lx: 280, ly: 260, label: 'implements' },
        { d: 'M 660 300 L 490 230', lx: 580, ly: 260, label: 'implements' },
        { d: 'M 520 380 L 340 380', lx: 430, ly: 370, label: 'controls access & delegates' }
      ],
      flowNodes: [
        { x: 50, y: 140, w: 200, h: 140, step: '1', title: 'Client Query', stroke: '#38bdf8', lines: ['Client invokes db.query("SELECT")', 'Client interacts with Proxy', 'Identical interface contract'] },
        { x: 280, y: 140, w: 210, h: 140, step: '2', title: 'Security Check', stroke: '#ef4444', lines: ['Proxy inspects user role', 'Rejects unauthorized users', 'Throws AccessDeniedException'] },
        { x: 520, y: 140, w: 210, h: 140, step: '3', title: 'LRU Cache Audit', stroke: '#f59e0b', lines: ['Checks in-memory cache', 'Returns cached data if hit', 'Zero network socket traffic'] },
        { x: 760, y: 140, w: 200, h: 140, step: '4', title: 'Lazy Execution', stroke: '#10b981', lines: ['On cache miss: delegates to real DB', 'Stores result in cache', 'Returns records to caller'] }
      ],
      flowConns: [
        { d: 'M 250 200 L 280 200', lx: 265, ly: 190, label: 'call' },
        { d: 'M 490 200 L 520 200', lx: 505, ly: 190, label: 'authorize' },
        { d: 'M 730 200 L 760 200', lx: 745, ly: 190, label: 'delegate' }
      ],
      sections: [
        {
          heading: "1. Architectural Intent: Controlled Access & Indirection Semantics",
          body: "The Proxy pattern introduces an intermediary surrogate that controls, restricts, or enhances access to an underlying target object without changing the target object's interface. While the Decorator pattern exists to add new responsibilities or features to an object, the Proxy pattern exists primarily to manage the lifecycle, security, network transport, or access costs of the underlying object.",
          bullets: [
            "Protection Proxy: Enforces role-based authorization (RBAC) before allowing calls to reach sensitive backend business logic.",
            "Virtual Proxy: Defers the creation or loading of expensive objects (e.g. 50MB images, large dataset queries) until the moment a method is actually invoked.",
            "Remote Proxy: Abstracts RPC/network boundaries, serializing method calls into JSON/Protobuf packets across the wire (e.g., gRPC client stubs).",
            "Caching Proxy: Intercepts read queries and serves results directly from memory if cached."
          ]
        },
        {
          heading: "2. Virtual, Protection, Caching, and Remote Proxy Mechanics",
          body: "At runtime, client code holds a reference typed to the Subject interface. When a method is called, the proxy intercepts the invocation. For a Virtual Proxy, if the real subject has not yet been initialized, the proxy instantiates it lazily on demand. For a Protection Proxy, it inspects security credentials and aborts execution if authorization fails. In Spring Boot, Spring creates dynamic proxies (via JDK dynamic proxies or ByteBuddy/CGLIB) to wrap beans with transaction management (@Transactional) and security checks (@PreAuthorize).",
          bullets: [
            "JDK Dynamic Proxies: Generates proxy classes at runtime using java.lang.reflect.Proxy for any interface.",
            "CGLIB / ByteBuddy: Generates proxy subclasses by subclassing concrete classes directly, bypassing the requirement for an interface.",
            "Lazy Loading Lifecycle: The client remains completely agnostic to whether the underlying real subject is loaded in memory, situated in a remote cloud cluster, or lazily fetched."
          ]
        },
        {
          heading: "3. Failure Modes: Self-Invocation Bypass in Spring AOP & LazyInitializationException",
          body: "The single most common bug in modern enterprise Java arises from misunderstanding Proxies. In Spring, if method A() calls method B() on the *same class* ('this.B()'), and B() is annotated with @Transactional or @Cacheable, the transaction or cache will NOT work! Because the call is internal via 'this', it completely bypasses the Spring proxy wrapper. Another classic proxy failure is Hibernate's LazyInitializationException when accessing a lazy proxy after the database session has closed.",
          bullets: [
            "Spring AOP Self-Invocation Pitfall: Internal method calls do not pass through the dynamic proxy; @Transactional annotations on internal calls are silently ignored.",
            "Hibernate LazyInitializationException: Occurs when accessing a Virtual Proxy entity outside the active persistence context/transaction boundary.",
            "Memory Leaks in Caching Proxies: Proxies that cache method return values without an eviction policy (LRU / TTL) will eventually trigger JVM Out-Of-Memory errors."
          ]
        },
        {
          heading: "4. Production Blueprint: Dynamic Caching & Security Proxy in Java 21",
          body: "The following production Java implementation showcases a Caching and Protection Proxy safeguarding an expensive database service with role-based access control and LRU result caching.",
          bullets: [
            "DatabaseService Contract: Interface implemented by both real database and proxy.",
            "CachingSecurityProxy: Validates caller permissions and intercepts queries via concurrent cache."
          ],
          codeSnippet: {
            title: "Production Caching & Security Proxy in Java 21",
            code: `public interface DatabaseService {
    String query(String sql);
}

// Real Subject (Expensive Resource)
public class PostgresDatabaseService implements DatabaseService {
    public PostgresDatabaseService() {
        System.out.println("[Postgres] Heavy connection pool initialized");
    }

    @Override
    public String query(String sql) {
        System.out.println("[Postgres] Executing SQL over TCP: " + sql);
        return "Records for [" + sql + "]";
    }
}

// Protection and Caching Proxy
public class CachingSecurityProxy implements DatabaseService {
    private final DatabaseService realService;
    private final Map<String, String> cache = new ConcurrentHashMap<>();
    private final Set<String> authorizedRoles;

    public CachingSecurityProxy(DatabaseService realService, Set<String> authorizedRoles) {
        this.realService = Objects.requireNonNull(realService);
        this.authorizedRoles = Set.copyOf(authorizedRoles);
    }

    @Override
    public String query(String sql) {
        // 1. Protection Proxy: Security Check
        String currentRole = SecurityContext.getCurrentRole();
        if (!authorizedRoles.contains(currentRole)) {
            throw new SecurityException("Access denied for role: " + currentRole);
        }

        // 2. Caching Proxy: Memory Lookup
        return cache.computeIfAbsent(sql, queryKey -> {
            System.out.println("[Proxy] Cache miss. Delegating to real subject...");
            return realService.query(queryKey);
        });
    }
}`
          }
        }
      ],
      tradeOffs: [
        {
          option: "Proxy Pattern",
          pros: "Separates security, caching, and network mechanics from business logic; enables lazy loading.",
          cons: "Introduces latency overhead; debugging dynamic proxies can produce confusing stack traces.",
          bestFor: "Hibernate lazy loading, Spring declarative transactions, API rate limiting, remote RPC stubs."
        },
        {
          option: "Direct Object Invocations",
          pros: "Zero indirection, crystal clear stack traces, trivial to step-debug.",
          cons: "Couples business logic directly with security, network, and caching code.",
          bestFor: "Pure domain entities without cross-cutting security or remote requirements."
        },
        {
          option: "Decorator Pattern",
          pros: "Focuses on dynamically augmenting or modifying the behavior of the component.",
          cons: "Does not typically manage the lifecycle or restrict access to the target object.",
          bestFor: "Stream transformations, middleware interceptor pipelines."
        }
      ],
      interviewTip: "When interviewers ask 'How does Spring @Transactional work under the hood?', explain: 'Spring wraps the bean in a dynamic proxy (JDK dynamic proxy if interface-based, or CGLIB subclass). When a client calls a transactional method, the proxy intercepts the call, begins a JDBC transaction, delegates to the target method, and commits or rolls back based on exceptions. This is also why calling another transactional method on the same class via `this` bypasses the transaction!'"
    },
    {
      id: "composite",
      subtopicNumber: "2.5",
      title: "Composite Pattern",
      subtitle: "Composes objects into tree structures to represent part-whole hierarchies, letting clients treat individual objects and compositions uniformly.",
      readingTime: "8 min read",
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
          heading: "1. Architectural Intent: Uniform Treatment of Part-Whole Hierarchies",
          body: "In complex domain trees like e-commerce packaging (boxes containing smaller boxes and individual products) or graphic renderers (groups containing shapes and other nested groups), writing special-cased code for leaves versus containers results in brittle switch statements. The Composite pattern enables clients to treat nested trees as if they were a single uniform object.",
          bullets: [
            "Polymorphic Recursion: Complex hierarchies calculate results through natural recursive polymorphism.",
            "Open/Closed Principle: Introduce new leaf components or container types without changing client code.",
            "Simplified Client Logic: Eliminates cumbersome typecasting and deep nested iterative loops."
          ]
        },
        {
          heading: "2. Recursive Polymorphism & Tree Traversal Execution Mechanics",
          body: "In a Composite tree, when an operation (like calculateSize() or render()) is invoked on a composite node, that node simply iterates over its internal collection of child components and invokes the identical method on each child. For Leaf nodes, the method executes the concrete calculation (the base case). For sub-composite nodes, it triggers another nested iteration. The client initiating the root call has zero knowledge of whether the tree is 1 node deep or 1,000 nodes deep.",
          bullets: [
            "Uniform Interface: Both Leaf and Composite implement the same root Component interface.",
            "Implicit Recursion: Eliminates the need for external tree visitor loops or stack management.",
            "Composite as Leaf: A Composite can be added as a child of another Composite without changing any logic."
          ]
        },
        {
          heading: "3. Transparency vs Safety: Interface Segregation in Component Trees",
          body: "A classic design debate in Composite is Transparency versus Safety. In the Transparency approach, child management methods (add(), remove(), getChild()) are defined on the base Component interface, allowing clients to treat leaves and composites with 100% uniformity; however, calling add() on a Leaf either does nothing or throws an exception (violating Liskov Substitution). In the Safety approach, child management methods are defined exclusively on the Composite class, requiring clients to cast or distinguish composites when building the tree.",
          bullets: [
            "Safety Preferred: In strongly typed languages (Java, TypeScript), the Safety approach is generally preferred to catch illegal child additions at compile time.",
            "Cyclic Graph Hazards: If a composite node accidentally adds one of its ancestors as a child, recursive operations will trigger an infinite loop and StackOverflowError.",
            "Parent References: Maintaining a parent pointer in each child simplifies upwards traversal, but requires synchronized two-way updates during additions and removals."
          ]
        },
        {
          heading: "4. Production Blueprint: Enterprise File System & AST Node Evaluator in Java 21",
          body: "The following production Java implementation showcases an enterprise File System tree hierarchy featuring recursive size calculation, structural rendering, and safety-oriented child management.",
          bullets: [
            "FileSystemNode Contract: Defines uniform size calculation and hierarchy rendering.",
            "DirectoryComposite: Manages children safely and computes aggregate disk footprint."
          ],
          codeSnippet: {
            title: "Production Composite File System Architecture in Java 21",
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
    public void add(FileSystemNode node) { children.add(Objects.requireNonNull(node)); }
    public void remove(FileSystemNode node) { children.remove(node); }

    @Override
    public long calculateSizeBytes() {
        return children.stream().mapToLong(FileSystemNode::calculateSizeBytes).sum();
    }

    @Override
    public void render(int depth) {
        System.out.printf("%s+ Dir: %s%n", "  ".repeat(depth), name);
        for (FileSystemNode child : children) {
            child.render(depth + 1);
        }
    }
}`
          }
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
        },
        {
          option: "Decorator Pattern",
          pros: "Wraps a single component to add behavior without tree hierarchy mechanics.",
          cons: "Cannot represent multiple children or part-whole trees.",
          bestFor: "Single-item interceptor wrapping rather than multi-item branch trees."
        }
      ],
      interviewTip: "When discussing Composite, address the trade-off between Transparency (defining child management methods like add() and remove() in the base Component interface) versus Safety (defining them only on the Composite class). Explain why Safety is generally preferred in strongly typed enterprise codebases to uphold the Liskov Substitution Principle."
    },
    {
      id: "bridge",
      subtopicNumber: "2.6",
      title: "Bridge Pattern",
      subtitle: "Decouples an abstraction from its implementation so that the two can vary independently.",
      readingTime: "9 min read",
      difficulty: "Advanced",
      accent: "#a855f7",
      keyTakeaways: [
        "Prevents a Cartesian Product explosion of class hierarchies (e.g. M abstractions * N platforms = M * N classes) by splitting them into two independent dimensions: Abstraction and Implementation.",
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
          heading: "1. Architectural Intent: Orthogonal Dimension Decomposition & Cartesian Explosion Avoidance",
          body: "Consider a UI framework with shapes (Circle, Square) and colors (Red, Blue). In traditional inheritance, adding 1 shape and 1 color requires creating RedCircle, BlueCircle, RedSquare, BlueSquare. If you have 10 shapes and 5 platforms, you need 50 subclasses! The Bridge pattern decouples Shape (the abstraction) from Platform/Renderer (the implementation) into two separate orthogonal class hierarchies connected by object composition.",
          bullets: [
            "Eliminates Class Multiplications: With Bridge, M abstractions and N implementors requires only M + N classes instead of M * N.",
            "Runtime Implementation Switching: The client can change the underlying implementor of an abstraction dynamically at runtime.",
            "True Information Hiding: Completely isolates platform-dependent hardware/OS details from consumer code."
          ]
        },
        {
          heading: "2. Decoupling Abstraction from Implementation: Runtime Bridge Binding",
          body: "The Abstraction class defines high-level business control logic and maintains a reference to an Implementor interface. The Implementor interface defines low-level primitive operations (e.g. drawLine(), openSocket()). The refined abstractions formulate high-level concepts by orchestrating the implementor's primitive methods. This allows driver developers to write concrete implementors for Windows, Linux, or WebGL without knowing how shapes or windows are structured.",
          bullets: [
            "Abstraction: Controls high-level business policy and user-facing APIs.",
            "Implementor: Provides concrete low-level primitive operations tailored to underlying platforms.",
            "Decoupled Evolution: Adding a new 3D graphics API (e.g., Vulkan) requires zero edits to existing shape abstraction classes."
          ]
        },
        {
          heading: "3. Failure Modes: Over-Engineering Trivial Hierarchies & State Synchronization",
          body: "The Bridge pattern introduces a significant architectural abstraction tax. If your application only runs on a single platform and will never support multiple rendering backends, applying Bridge introduces unnecessary indirection and cognitive load. Furthermore, if the Abstraction requires deep knowledge of the Implementor's internal hardware state, tight coupling re-emerges through leaky methods.",
          bullets: [
            "Cognitive Overhead: Harder for junior engineers to trace through dual-hierarchy method calls compared to single-class inheritance.",
            "Premature Generalization: Applying Bridge to domains that only have a single implementation creates useless boilerplate.",
            "Granularity Mismatch: If abstraction operations require too many round-trip calls across the bridge, performance degrades."
          ]
        },
        {
          heading: "4. Production Blueprint: Enterprise Cross-Platform Notification Engine in TypeScript",
          body: "The following production TypeScript implementation demonstrates an enterprise Notification Delivery system decoupling alert priority policies (Abstraction) from transport channels (Implementor).",
          bullets: [
            "MessageChannel Implementor: Transports payloads across Twilio, Slack, and Email.",
            "AlertNotification Abstraction: Enforces urgent escalation, logging, and retry semantics."
          ],
          codeSnippet: {
            title: "Production Notification Engine with Bridge in TypeScript",
            code: `// 1. Implementor Interface
export interface MessageChannel {
  deliver(recipient: string, body: string): Promise<boolean>;
  getChannelName(): string;
}

// 2. Concrete Implementors
export class TwilioSmsChannel implements MessageChannel {
  async deliver(recipient: string, body: string): Promise<boolean> {
    console.log(\`[Twilio SMS] Sending to \${recipient}: \${body}\`);
    return true;
  }
  getChannelName(): string { return "SMS"; }
}

export class SlackWebhookChannel implements MessageChannel {
  async deliver(recipient: string, body: string): Promise<boolean> {
    console.log(\`[Slack Webhook] Sending to \${recipient}: \${body}\`);
    return true;
  }
  getChannelName(): string { return "SLACK"; }
}

// 3. Abstraction
export abstract class AlertNotification {
  protected channel: MessageChannel; // The Bridge

  constructor(channel: MessageChannel) {
    this.channel = channel;
  }

  public setChannel(channel: MessageChannel): void {
    this.channel = channel;
  }

  public abstract sendAlert(recipient: string, message: string): Promise<void>;
}

// 4. Refined Abstraction
export class UrgentCriticalAlert extends AlertNotification {
  public async sendAlert(recipient: string, message: string): Promise<void> {
    const formatted = \`[CRITICAL P0 ALERT] \${message.toUpperCase()} - ACK REQUIRED\`;
    console.log(\`[Audit] Escalating alert via \${this.channel.getChannelName()}\`);
    await this.channel.deliver(recipient, formatted);
  }
}`
          }
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
        },
        {
          option: "Adapter Pattern",
          pros: "Converts an existing incompatible interface into a target interface after code is already written.",
          cons: "Does not split orthogonal design dimensions up front.",
          bestFor: "Retrofitting third-party SDKs into an existing system."
        }
      ],
      interviewTip: "Interviewers frequently ask candidates to contrast Bridge vs Adapter. Explain: 'Adapter is applied *after* systems are built to make incompatible third-party interfaces work together. Bridge is designed *up front* to let abstraction and implementation evolve independently along orthogonal dimensions.'"
    },
    {
      id: "flyweight",
      subtopicNumber: "2.7",
      title: "Flyweight Pattern",
      subtitle: "Minimizes memory usage by sharing as much data as possible with similar objects.",
      readingTime: "9 min read",
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
          heading: "1. Architectural Intent: Slashing Heap Memory Footprints via Intrinsic State Deduplication",
          body: "When rendering a 3D forest with 1,000,000 trees or a rich-text document with 5,000,000 characters, creating an independent heap object for each entity that stores its font geometry, textures, or polygon meshes requires gigabytes of RAM, triggering constant Garbage Collection thrashing and OOM crashes. Flyweight extracts invariant, shareable data (Intrinsic state) into a single immutable instance, leaving only unique coordinates or context (Extrinsic state) in lightweight structures.",
          bullets: [
            "Intrinsic State: Heavy, invariant, read-only data stored directly inside the Flyweight object. Shared safely across all instances.",
            "Extrinsic State: Transient, contextual data (coordinates, timestamps, specific colors) held by client contexts and passed as method arguments.",
            "Immutability Requirement: Flyweight instances must be strictly immutable to avoid cross-context race conditions and data corruption."
          ]
        },
        {
          heading: "2. Intrinsic vs Extrinsic State: Memory Layout & JVM Allocation Mechanics",
          body: "In standard object layouts (such as the HotSpot 64-bit JVM with compressed oops), each object header consumes 12–16 bytes plus field alignment padding. If each tree stores an 8-byte pointer to a 20MB texture, 1,000,000 trees sharing that single texture pointer consume only 24MB of context memory in total. If the 20MB texture were duplicated per tree, the application would require 20 Terabytes of RAM! Flyweight turns an impossible memory problem into a trivial in-memory array.",
          bullets: [
            "Flyweight Factory: Acts as a cache manager (Map<Key, Flyweight>) ensuring existing shared instances are reused rather than newly allocated.",
            "String Interning & Number Caches: Java's String.intern() and Integer.valueOf(-128 to 127) are textbook production Flyweight implementations.",
            "Context Structs: In languages like C# or Go, context objects can be allocated as flat value types / structs on the stack, eliminating heap allocation completely."
          ]
        },
        {
          heading: "3. Failure Modes: Thread-Safety Violations in Mutated Flyweights & Cache Thrashing",
          body: "The most dangerous defect in a Flyweight implementation occurs when a developer inadvertently adds mutable fields to the Flyweight class. If Thread A calls flyweight.setIntensity(10) thinking it affects only its own entity, that mutation instantly corrupts the visual appearance or behavior of all 1,000,000 other instances in the system! Flyweights must be enforced as strictly immutable records.",
          bullets: [
            "Mutable State Bleed: Never store extrinsic context in flyweight instance fields; always pass it into methods as parameters.",
            "Cache Memory Leaks: If the Flyweight Factory creates unique flyweights for unbounded dynamic keys without eviction or weak references, the factory itself will leak memory.",
            "CPU vs RAM Trade-Off: Passing extrinsic parameters through multiple call stacks slightly increases CPU register usage to achieve dramatic memory savings."
          ]
        },
        {
          heading: "4. Production Blueprint: High-Scale Financial Market Depth & Particle Engine in Java 21",
          body: "The following production Java implementation demonstrates an ultra-high throughput Market Order Particle simulator sharing immutable instrument metadata across millions of tick records.",
          bullets: [
            "InstrumentMetadata (Flyweight): Immutable shareable financial product specifications.",
            "FlyweightFactory: Concurrent registry deduplicating market symbols.",
            "MarketTick (Context): Ultra-lightweight record holding timestamp, price, and flyweight reference."
          ],
          codeSnippet: {
            title: "Production Flyweight Financial Order Book in Java 21",
            code: `// 1. The Flyweight (Immutable, Intrinsic State)
public record InstrumentMetadata(
    String symbol,
    String exchange,
    Currency currency,
    BigDecimal tickSize
) {
    public void printMarketDepth(long priceInCents, int quantity, long timestamp) {
        // Extrinsic state passed dynamically as arguments
        System.out.printf("[%s] %s: %d units @ %s (Exchange: %s)%n",
            Instant.ofEpochMilli(timestamp),
            symbol,
            quantity,
            new BigDecimal(priceInCents).movePointLeft(2),
            exchange
        );
    }
}

// 2. Flyweight Factory
public class InstrumentFactory {
    private static final Map<String, InstrumentMetadata> registry = new ConcurrentHashMap<>();

    public static InstrumentMetadata getInstrument(String symbol, String exchange, Currency currency, BigDecimal tickSize) {
        return registry.computeIfAbsent(symbol, s -> 
            new InstrumentMetadata(s, exchange, currency, tickSize)
        );
    }
}

// 3. Context Object (Lightweight Extrinsic State + Flyweight Pointer)
public record MarketTick(long timestamp, long priceInCents, int quantity, InstrumentMetadata instrument) {
    public void display() {
        instrument.printMarketDepth(priceInCents, quantity, timestamp);
    }
}`
          }
        }
      ],
      tradeOffs: [
        {
          option: "Flyweight Pattern",
          pros: "Saves massive amounts of heap memory; prevents JVM GC thrashing and Out-Of-Memory crashes.",
          cons: "Trades RAM for CPU cycles (passing extrinsic state on the fly); more complex architecture.",
          bestFor: "Game particle systems, UI text rendering engines, caching financial market order books."
        },
        {
          option: "Standard Fat Objects",
          pros: "Simple, highly self-contained objects; state and logic are bundled together.",
          cons: "Devours memory when scaling to millions of active instances.",
          bestFor: "Domain models with small instance counts (< 10,000)."
        },
        {
          option: "Object Pooling",
          pros: "Reuses mutable objects to avoid allocation costs; objects have exclusive ownership while checked out.",
          cons: "Requires checking objects in and out; concurrency contention on pool locks.",
          bestFor: "Heavyweight mutable resources like database socket connections or thread pools."
        }
      ],
      interviewTip: "In interviews, cite `Integer.valueOf(int)` as Java's built-in Flyweight: Java pre-allocates and caches `Integer` objects from -128 to 127 in memory. Calling `Integer.valueOf(5) == Integer.valueOf(5)` returns `true` because they point to the exact same shared Flyweight instance."
    }
  ]
};

const targetPath = path.join(__dirname, 'designPatternsMod2.js');
const fileContent = `/* eslint-disable @typescript-eslint/no-require-imports */\n\nconst STRUCTURAL_PATTERNS = ${JSON.stringify(STRUCTURAL_PATTERNS, null, 2)};\n\nmodule.exports = { STRUCTURAL_PATTERNS };\n`;

fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log('Successfully enriched Structural Patterns in designPatternsMod2.js!');
