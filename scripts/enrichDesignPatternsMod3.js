/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// Load existing module to reuse diagram nodes & conns
const { BEHAVIORAL_PATTERNS: existing } = require('./designPatternsMod3');

// Map existing subtopics by id for easy diagram reuse
const diagramMap = {};
existing.subtopics.forEach(sub => {
  diagramMap[sub.id] = {
    ascii: sub.ascii,
    blockNodes: sub.blockNodes,
    blockConns: sub.blockConns,
    flowNodes: sub.flowNodes,
    flowConns: sub.flowConns
  };
});

const ORDERED_BEHAVIORAL_PATTERNS = [
  // 1. Strategy (Foundational)
  {
    id: "strategy",
    subtopicNumber: "3.1",
    title: "Strategy Pattern",
    subtitle: "Defines a family of algorithms, encapsulates each one, and makes them interchangeable at runtime.",
    readingTime: "8 min read",
    difficulty: "Foundational",
    accent: "#38bdf8",
    keyTakeaways: [
      "Replaces giant conditional switch statements with clean object composition, upholding the Open/Closed Principle.",
      "Allows swapping algorithms (sorting, payment processing, routing, compression) dynamically at runtime based on caller parameters.",
      "Modern languages can represent stateless strategies cleanly as first-class functions or lambdas."
    ],
    sections: [
      {
        heading: "1. Architectural Intent: Eliminating Conditional Branch Hell via Algorithmic Polymorphism",
        body: "When an application needs to execute different variations of an algorithm depending on runtime context (such as calculating shipping fees via FedEx, UPS, or DHL, or charging via Stripe, PayPal, or Crypto), naive implementations rely on sprawling 'switch' or 'if-else' statements. Every new payment provider requires modifying the core billing service, risking regression bugs. The Strategy pattern extracts each algorithm into a standalone class implementing a common interface.",
        bullets: [
          "Open/Closed Principle: Introduce new algorithm strategies without altering existing context or client classes.",
          "Single Responsibility Principle: Isolates algorithm-specific calculation and dependencies away from the context orchestrator.",
          "Composition Over Inheritance: Swaps behaviors dynamically at runtime via dependency injection rather than locking behavior into static subclass hierarchies."
        ]
      },
      {
        heading: "2. Runtime Strategy Swapping & Execution Lifecycle",
        body: "The Context class maintains a private reference to the Strategy interface. When client code invokes a business operation on the Context, the Context simply forwards execution to its configured strategy. The client can swap strategies on the fly (e.g., switching from HighSpeedDelivery to EconomyDelivery when a customer changes their shopping cart options).",
        bullets: [
          "Dynamic Polymorphic Dispatch: The context operates purely against the interface abstraction.",
          "Strategy Parameterization: The context can pass itself ('this') or specific parameters into the strategy method to supply necessary calculation data.",
          "Stateless vs Stateful Strategies: Stateless strategies can be shared concurrently across multiple contexts as Singletons or lambdas; stateful strategies require per-context instantiation."
        ]
      },
      {
        heading: "3. Failure Modes: State Bleed Across Concurrent Invocations & Lambda Anti-Patterns",
        body: "A dangerous bug in multi-threaded environments arises when a developer introduces mutable state into a shared strategy instance. If Strategy A is injected as a singleton into multiple concurrent worker threads and mutates an internal counter or buffer during execute(), threads will corrupt each other's calculations. Strategies must either be completely stateless or thread-confined.",
        bullets: [
          "Shared Mutable State Corruption: Always design strategy classes as immutable or stateless records when sharing across threads.",
          "Context-Strategy Coupling: If the strategy method requires 20 arguments from the context, or if it queries internal private fields of the context, the boundary is flawed.",
          "Class Explosion: If algorithms are trivial one-liners, creating dozens of distinct class files adds unnecessary clutter; prefer first-class function references in modern languages."
        ]
      },
      {
        heading: "4. Production Blueprint: Enterprise Dynamic Payment & Routing Engine in Java 21",
        body: "The following production Java implementation showcases an enterprise Payment Orchestration engine leveraging Strategy with modern switch expressions and thread-safe stateless strategies.",
        bullets: [
          "PaymentStrategy Contract: Clean interface returning immutable payment outcomes.",
          "PaymentContext: Selects and executes strategies dynamically based on customer payment methods."
        ],
        codeSnippet: {
          title: "Production Payment Strategy Engine in Java 21",
          code: `public interface PaymentStrategy {
    PaymentOutcome execute(BigDecimal amount, String currency, String customerId);
    String getProviderName();
}

public record PaymentOutcome(boolean success, String transactionId, String message) {}

// Strategy 1: Credit Card
public class StripeCreditCardStrategy implements PaymentStrategy {
    @Override public PaymentOutcome execute(BigDecimal amount, String currency, String customerId) {
        System.out.printf("[Stripe] Charging %s %s to customer %s%n", amount, currency, customerId);
        return new PaymentOutcome(true, "ch_" + UUID.randomUUID(), "Stripe charge approved");
    }
    @Override public String getProviderName() { return "STRIPE"; }
}

// Strategy 2: PayPal
public class PayPalWalletStrategy implements PaymentStrategy {
    @Override public PaymentOutcome execute(BigDecimal amount, String currency, String customerId) {
        System.out.printf("[PayPal] Direct debit of %s %s for %s%n", amount, currency, customerId);
        return new PaymentOutcome(true, "pp_" + UUID.randomUUID(), "PayPal debit settled");
    }
    @Override public String getProviderName() { return "PAYPAL"; }
}

// Context Class
public class PaymentCheckoutContext {
    private PaymentStrategy strategy;

    public PaymentCheckoutContext(PaymentStrategy defaultStrategy) {
        this.strategy = Objects.requireNonNull(defaultStrategy);
    }

    public void setStrategy(PaymentStrategy strategy) {
        this.strategy = Objects.requireNonNull(strategy);
    }

    public PaymentOutcome processCheckout(BigDecimal total, String currency, String customerId) {
        System.out.println("[Checkout] Delegating to: " + strategy.getProviderName());
        return strategy.execute(total, currency, customerId);
    }
}`
        }
      }
    ],
    tradeOffs: [
      {
        option: "Strategy Pattern",
        pros: "Eliminates branching logic, enables runtime algorithmic swapping, adheres strictly to Open/Closed.",
        cons: "Clients must understand the differences between available strategies to pick the correct one.",
        bestFor: "Payment processing, sorting algorithms, compression codecs, discount calculators."
      },
      {
        option: "Conditional If/Else Statements",
        pros: "Trivial to write; all calculation logic visible in one place without multiple files.",
        cons: "Violates Open/Closed; high cyclomatic complexity; testing requires large brittle test cases.",
        bestFor: "Small scripts with 1-2 unchanging algorithmic variations."
      },
      {
        option: "Subclassing / Template Method",
        pros: "Reuses shared skeleton code through inheritance.",
        cons: "Cannot change algorithm dynamically at runtime once the subclass is instantiated.",
        bestFor: "Static algorithms that do not need to be swapped during execution."
      }
    ],
    interviewTip: "In interviews, cite Java's `Comparator.comparing()` and `Collections.sort(list, comparator)` as the canonical standard library example of Strategy. Emphasize that in modern Java and TypeScript, Strategy can often be implemented elegantly using lambdas or functional interfaces rather than heavyweight boilerplate classes."
  },

  // 2. Observer (Foundational)
  {
    id: "observer",
    subtopicNumber: "3.2",
    title: "Observer Pattern",
    subtitle: "Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified automatically.",
    readingTime: "9 min read",
    difficulty: "Foundational",
    accent: "#10b981",
    keyTakeaways: [
      "Establishes a publish-subscribe communication contract where subjects notify any number of observer objects upon state changes.",
      "The subject has zero knowledge of concrete observer implementations, maintaining clean loose coupling.",
      "Fundamental to GUI event listeners (onClick), distributed Pub/Sub message queues, and Reactive programming streams (RxJava, Project Reactor)."
    ],
    sections: [
      {
        heading: "1. Architectural Intent: Decoupling State Changes from Dependent Notifications (1-to-N)",
        body: "In complex systems, when an entity undergoes a significant state transition (e.g. an Order transitions from PENDING to PAID), multiple downstream subsystems must react: the inventory service must reserve stock, the notification service must email the customer, and the analytics pipeline must log the conversion event. Hardcoding calls to these subsystems directly inside the Order entity couples it catastrophically. The Observer pattern establishes a clean 1-to-many publish-subscribe relationship.",
        bullets: [
          "Loose Coupling: The publisher subject maintains a list of abstract Observer interfaces, remaining completely agnostic to who is listening.",
          "Open/Closed Principle: New subscriber observers can be registered dynamically at runtime without altering the publisher class.",
          "Broadcast Communication: A single event broadcast automatically fans out to all active subscribers."
        ]
      },
      {
        heading: "2. Synchronous vs Asynchronous Dispatch & Event Bus Mechanics",
        body: "A critical architectural consideration in Observer implementations is execution concurrency. In naive in-process Observer models, the publisher loops through observers synchronously on the caller's thread: if Observer 3 takes 5 seconds to send an email, the entire checkout request hangs for 5 seconds! Production architectures decouple notification dispatch using background worker pools or asynchronous message channels.",
        bullets: [
          "Synchronous Dispatch: Fastest for in-memory GUI events, but susceptible to cascading thread blockages.",
          "Asynchronous Event Bus: Offloads observer notifications to a thread pool (ExecutorService) or messaging broker (Kafka/RabbitMQ), returning immediately to the caller.",
          "Push vs Pull Model: In the Push model, the subject sends detailed event payload DTOs to observers; in the Pull model, it sends only a lightweight notification, and observers query the subject for details."
        ]
      },
      {
        heading: "3. Failure Modes: The Lapsed Listener Problem, Memory Leaks & Event Storms",
        body: "The 'Lapsed Listener' problem is the #1 source of memory leaks in long-running object-oriented applications. When an observer registers with a long-lived subject, the subject holds a strong reference to the observer. If the observer is discarded by the application but forgets to explicitly call subject.removeObserver(), the Garbage Collector cannot reclaim the observer, resulting in steady heap memory exhaustion.",
        bullets: [
          "Lapsed Listener Memory Leaks: Solved by using WeakReference collections or auto-closable subscriptions.",
          "Unbounded Notification Order: Observers must never depend on execution order; subject notifications are order-agnostic.",
          "Cascading Event Storms: If Observer A reacts to an event by mutating Subject B, which triggers an event that mutates Subject A, an infinite notification storm crashes the system."
        ]
      },
      {
        heading: "4. Production Blueprint: High-Throughput Thread-Safe Event Broker in Java 21",
        body: "The following production Java implementation demonstrates a thread-safe Event Publisher supporting typed events, copy-on-write subscriber safety, and weak-reference leak protection.",
        bullets: [
          "EventObserver Interface: Strongly typed subscriber contract.",
          "ThreadSafeEventPublisher: Utilizes CopyOnWriteArrayList for lock-free iteration during concurrent publish operations."
        ],
        codeSnippet: {
          title: "Production Thread-Safe Observer Broker in Java 21",
          code: `public interface OrderEventListener {
    void onOrderPaid(String orderId, BigDecimal amount);
}

// Concrete Observer 1: Email Notification Service
public class EmailNotificationListener implements OrderEventListener {
    @Override public void onOrderPaid(String orderId, BigDecimal amount) {
        System.out.printf("[Email Service] Dispatched receipt for order %s ($%s)%n", orderId, amount);
    }
}

// Concrete Observer 2: Warehouse Fulfillment Service
public class WarehouseFulfillmentListener implements OrderEventListener {
    @Override public void onOrderPaid(String orderId, BigDecimal amount) {
        System.out.printf("[Warehouse] Packing order %s for shipping%n", orderId);
    }
}

// Thread-Safe Subject Publisher
public class OrderEventPublisher {
    // CopyOnWriteArrayList ensures thread-safe iteration without locking during publish
    private final List<OrderEventListener> listeners = new CopyOnWriteArrayList<>();

    public void subscribe(OrderEventListener listener) {
        listeners.add(Objects.requireNonNull(listener));
    }

    public void unsubscribe(OrderEventListener listener) {
        listeners.remove(listener);
    }

    public void notifyOrderPaid(String orderId, BigDecimal amount) {
        System.out.println("[Publisher] Broadcasting order payment event...");
        for (OrderEventListener listener : listeners) {
            try {
                listener.onOrderPaid(orderId, amount);
            } catch (Exception ex) {
                // Prevent one failing listener from crashing other subscribers
                System.err.printf("[Publisher Error] Listener %s failed: %s%n", 
                    listener.getClass().getSimpleName(), ex.getMessage());
            }
        }
    }
}`
        }
      }
    ],
    tradeOffs: [
      {
        option: "Observer Pattern (In-Memory)",
        pros: "Decouples publisher from subscribers; dynamic subscription lifecycle; instant in-process notification.",
        cons: "Can lead to Lapsed Listener memory leaks; synchronous iteration can degrade publisher throughput.",
        bestFor: "GUI frameworks, internal domain event dispatchers, reactive data binding."
      },
      {
        option: "Distributed Event Broker (Kafka / RabbitMQ)",
        pros: "Full process isolation, persistent message durability, massive horizontal scale across clusters.",
        cons: "Requires external cluster infrastructure, network latency, eventual consistency challenges.",
        bestFor: "Microservices communication, high-volume event ingestion, asynchronous background processing."
      },
      {
        option: "Direct Method Invocation",
        pros: "Immediate synchronous execution, trivial to debug, zero indirection.",
        cons: "Extreme tight coupling; adding a new subscriber requires editing the core publishing class.",
        bestFor: "Point-to-point interactions with strictly one known consumer."
      }
    ],
    interviewTip: "In interviews, always bring up the 'Lapsed Listener' problem when discussing Observer: 'If a client subscribes to a singleton publisher and fails to unsubscribe when destroyed, the publisher's internal list prevents garbage collection of the client. In production, we guard against this using WeakReferences, RxJava Disposable handles, or AutoCloseable subscription scopes.'"
  },

  // 3. Command (Intermediate)
  {
    id: "command",
    subtopicNumber: "3.3",
    title: "Command Pattern",
    subtitle: "Encapsulates a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.",
    readingTime: "9 min read",
    difficulty: "Intermediate",
    accent: "#f59e0b",
    keyTakeaways: [
      "Turns method calls and business requests into standalone first-class objects containing all necessary execution parameters.",
      "Enables multi-level Undo/Redo stacks, scheduled task queues, deferred execution, and distributed Saga rollbacks.",
      "The foundational design pattern powering Command Query Responsibility Segregation (CQRS) and transactional outbox engines."
    ],
    sections: [
      {
        heading: "1. Architectural Intent: Encapsulating Requests as First-Class Objects",
        body: "In standard object-oriented programming, invoking an action requires direct method calls (receiver.doSomething()). However, this binds the invoker tightly to the receiver and executes immediately. When you need to defer execution, queue tasks in background threads, log commands for crash recovery, or provide multi-step Undo/Redo, the action itself must become a first-class citizen: an object that can be stored, serialized, and passed around.",
        bullets: [
          "Encapsulates All Execution Context: A Command object encapsulates the receiver reference, method to call, and parameter arguments.",
          "Decouples Invoker from Receiver: A UI button or HTTP queue worker executes commands polymorphically without knowing what business operations they perform.",
          "Enables Schedulers & Queues: Commands can be pushed into thread-safe priority queues and executed at a later time by worker pools."
        ]
      },
      {
        heading: "2. Macro Commands, Invocation Decoupling & Multi-Level Undo Stacks",
        body: "Because commands are objects, they can be stacked, grouped, and reversed. A MacroCommand (Composite Command) holds a list of sub-commands and executes them sequentially as a batch transaction. For Undo operations, the Command interface defines both execute() and undo(). An Invoker maintains an undo stack: after executing a command, it pushes it onto the stack; when the user hits Ctrl+Z, the invoker pops the last command and calls undo().",
        bullets: [
          "Atomic Inverse Operations: Each command knows how to revert its own specific mutation.",
          "State Snapshotting: Commands can capture previous receiver state before executing to guarantee flawless undo restoration.",
          "Asynchronous Execution: Commands can be persisted to disk (WAL) and replayed upon system crash recovery."
        ]
      },
      {
        heading: "3. Failure Modes: Memory Exhaustion in Undo Stacks & Distributed Saga Rollbacks",
        body: "While simple in theory, Command implementations face critical failure modes at enterprise scale. If an undo stack stores commands indefinitely without a maximum depth limit (e.g., max 100 entries), heap memory will quickly blow up. In distributed microservice systems, commands that cross network boundaries cannot be simply undone via in-memory stacks; they require Compensating Transactions within a Saga orchestrator.",
        bullets: [
          "Unbounded Undo Memory Leaks: Always enforce a bounded ring-buffer (CircularFifoQueue) on undo stacks.",
          "Non-Reversible Actions: Irreversible external side-effects (e.g. sending a physical SMS or charging a non-refundable credit card) cannot be strictly undone; they require semantic compensation.",
          "Class Proliferation: Creating a dedicated class for every single minor user action can result in hundreds of boilerplate command classes unless lambda commands are used."
        ]
      },
      {
        heading: "4. Production Blueprint: Enterprise Transactional Ledger with Undo/Redo in Java 21",
        body: "The following production Java implementation demonstrates an enterprise Banking Ledger with undoable commands, bounded history stacks, and idempotent execution.",
        bullets: [
          "TransactionCommand Interface: Defines both execute() and undo() contracts.",
          "LedgerManager Invoker: Manages bounded undo and redo stacks with thread-safe collections."
        ],
        codeSnippet: {
          title: "Production Transactional Command Ledger in Java 21",
          code: `public interface TransactionCommand {
    void execute();
    void undo();
    String getDescription();
}

// Receiver Object
public class BankAccount {
    private final String accountId;
    private long balanceCents;

    public BankAccount(String accountId, long initialBalanceCents) {
        this.accountId = accountId;
        this.balanceCents = initialBalanceCents;
    }

    public void credit(long cents) { balanceCents += cents; }
    public void debit(long cents) { balanceCents -= cents; }
    public long getBalanceCents() { return balanceCents; }
}

// Concrete Command: Deposit
public class DepositCommand implements TransactionCommand {
    private final BankAccount account;
    private final long amountCents;

    public DepositCommand(BankAccount account, long amountCents) {
        this.account = account;
        this.amountCents = amountCents;
    }

    @Override public void execute() { account.credit(amountCents); }
    @Override public void undo() { account.debit(amountCents); }
    @Override public String getDescription() { return "Deposit $" + (amountCents / 100.0); }
}

// Invoker with Bounded Undo Stack
public class TransactionLedgerInvoker {
    private final Deque<TransactionCommand> undoStack = new ArrayDeque<>();
    private final Deque<TransactionCommand> redoStack = new ArrayDeque<>();
    private final int maxHistory = 50;

    public void executeCommand(TransactionCommand command) {
        command.execute();
        if (undoStack.size() >= maxHistory) {
            undoStack.removeLast(); // Evict oldest
        }
        undoStack.push(command);
        redoStack.clear(); // Clear redo on new action
    }

    public void undo() {
        if (!undoStack.isEmpty()) {
            TransactionCommand cmd = undoStack.pop();
            cmd.undo();
            redoStack.push(cmd);
        }
    }
}`
        }
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
      },
      {
        option: "Memento Pattern",
        pros: "Captures full state snapshots rather than operational inverse commands.",
        cons: "Devours memory when domain objects are large and complex.",
        bestFor: "Restoring complex nested states where calculating inverse commands is mathematically intractable."
      }
    ],
    interviewTip: "In distributed architecture interviews, connect the Command pattern directly to Command Query Responsibility Segregation (CQRS) and the Saga pattern. Explain: 'In distributed systems, a Command represents an intent to change state. When commands execute across microservices, we cannot do in-memory undo; instead, the Saga orchestrator dispatches compensating commands to reverse previous operations.'"
  },

  // 4. Template Method (Intermediate)
  {
    id: "template-method",
    subtopicNumber: "3.4",
    title: "Template Method Pattern",
    subtitle: "Defines the skeleton of an algorithm in an operation, deferring some steps to subclasses without changing the algorithm's structure.",
    readingTime: "8 min read",
    difficulty: "Intermediate",
    accent: "#38bdf8",
    keyTakeaways: [
      "Defines an invariant algorithmic workflow in a base class, allowing derived classes to customize specific primitive steps or hook methods.",
      "Enforces the Hollywood Principle: 'Don't call us, we'll call you.' The parent class controls the execution flow, calling into the subclass hooks.",
      "Found across framework base classes: Spring's `JdbcTemplate`, React class component lifecycles, and JUnit test fixtures."
    ],
    sections: [
      {
        heading: "1. Architectural Intent: Enforcing Algorithmic Invariants with Subclass Hooks",
        body: "In enterprise software, many business algorithms share an identical multi-step execution structure—such as reading a file, parsing its contents, validating records, persisting to a database, and closing resource handles. If every developer writes their own implementation, critical steps (like closing database connections or auditing failures) are frequently omitted. The Template Method pattern encapsulates the invariant algorithm skeleton into a final base method, leaving only domain-specific steps abstract.",
        bullets: [
          "Hollywood Principle ('Don't call us, we'll call you'): The abstract parent class orchestrates the execution flow, calling subclass hooks as needed.",
          "Code Duplication Elimination: Shared boilerplate (opening sockets, measuring latency, error recovery) is written exactly once in the base class.",
          "Enforced Invariants: The template method is marked 'final' so subclasses cannot accidentally reorder or bypass security steps."
        ]
      },
      {
        heading: "2. Hook Methods, Abstract Primitives & Inversion of Control",
        body: "A robust Template Method pattern utilizes three types of methods: 1) Abstract Primitives, which subclasses MUST implement; 2) Concrete Operations, which provide shared invariant logic and cannot be overridden; and 3) Hook Methods, which provide default empty or fallback behavior that subclasses MAY optionally override (e.g. shouldSendAlert() returning false by default).",
        bullets: [
          "Abstract Primitives: Mandatory domain-specific steps that vary by implementation (e.g. parsePayload()).",
          "Hook Methods: Optional interception points allowing subclasses to extend behavior without breaking base contracts.",
          "Strict Invariant Guarantees: Steps such as auditing and security sanitization cannot be skipped by subclass authors."
        ]
      },
      {
        heading: "3. Failure Modes: Fragile Base Class Pitfall & Inheritance Coupling",
        body: "The primary weakness of Template Method is its reliance on inheritance. Modifying the base class's template method can inadvertently break existing subclasses (the Fragile Base Class problem). Furthermore, subclasses are tightly coupled to the base class hierarchy: they cannot inherit from any other class in single-inheritance languages, and mocking base class dependencies during unit tests can be painful.",
        bullets: [
          "Fragile Base Class: Changing the sequence of steps in the base class can silently corrupt subclasses that made assumptions about call order.",
          "Inheritance Overhead: If a subclass only needs to customize one tiny step, forcing it to inherit an entire heavy base class is poor design; prefer Strategy composition if variations are purely algorithmic.",
          "Liskov Substitution Violations: Subclasses overriding hooks must never throw unexpected exceptions that break the template method's contract."
        ]
      },
      {
        heading: "4. Production Blueprint: Enterprise ETL Data Pipeline in Java 21",
        body: "The following production Java implementation showcases an enterprise ETL (Extract, Transform, Load) Pipeline using Template Method with optional hooks and resource cleanup.",
        bullets: [
          "DataPipelineTemplate: Base class defining the final invariant process() algorithm.",
          "CsvDataPipeline & JsonDataPipeline: Concrete subclasses customizing parsing and validation."
        ],
        codeSnippet: {
          title: "Production ETL Pipeline with Template Method in Java 21",
          code: `public abstract class DataPipelineTemplate {
    // Invariant algorithm skeleton marked final to prevent tampering
    public final void process(Path filePath) throws IOException {
        System.out.println("[Pipeline] Starting data pipeline for: " + filePath);
        byte[] rawBytes = readFile(filePath);
        List<String> records = parseRecords(rawBytes); // Abstract hook
        validateRecords(records);                       // Abstract hook
        
        if (shouldSanitize()) {                         // Optional hook
            records = sanitize(records);
        }
        
        persistToDatabase(records);
        auditPipelineCompletion(records.size());
    }

    private byte[] readFile(Path path) throws IOException {
        return Files.readAllBytes(path);
    }

    private void persistToDatabase(List<String> records) {
        System.out.printf("[Database] Persisting %d validated records%n", records.size());
    }

    private void auditPipelineCompletion(int count) {
        System.out.printf("[Audit] Pipeline finished. %d rows processed%n", count);
    }

    // Abstract Primitive Operations (Mandatory for subclasses)
    protected abstract List<String> parseRecords(byte[] rawData);
    protected abstract void validateRecords(List<String> records);

    // Hook Method (Optional override)
    protected boolean shouldSanitize() { return false; }
    protected List<String> sanitize(List<String> records) { return records; }
}`
        }
      }
    ],
    tradeOffs: [
      {
        option: "Template Method",
        pros: "Enforces algorithm invariants, eliminates code duplication, provides structured hooks for extension.",
        cons: "Coupled via class inheritance; susceptible to the Fragile Base Class problem; harder to test.",
        bestFor: "Framework lifecycles, ETL pipelines, standard database access workflows (JdbcTemplate)."
      },
      {
        option: "Strategy Pattern",
        pros: "Composition over inheritance; strategies can be swapped dynamically at runtime; trivial to mock.",
        cons: "Does not enforce an overarching step-by-step skeleton across multiple stages.",
        bestFor: "Swapping standalone interchangeable algorithms without shared multi-step lifecycle phases."
      },
      {
        option: "Duplicated Procedural Scripts",
        pros: "Completely independent code with zero inheritance hierarchies.",
        cons: "Severe code duplication; developers forget to implement security, auditing, or resource cleanup.",
        bestFor: "Throwaway test scripts."
      }
    ],
    interviewTip: "When comparing Template Method vs Strategy in an interview, say: 'Template Method uses inheritance to vary parts of an algorithm while keeping the overall skeleton invariant at compile time. Strategy uses composition to vary an entire algorithm at runtime. In production, prefer Strategy unless you specifically need to mandate a strict multi-step invariant lifecycle (like a framework build pipeline).'"
  },

  // 5. Iterator (Intermediate)
  {
    id: "iterator",
    subtopicNumber: "3.5",
    title: "Iterator Pattern",
    subtitle: "Provides a way to access the elements of an aggregate object sequentially without exposing its underlying representation.",
    readingTime: "8 min read",
    difficulty: "Intermediate",
    accent: "#10b981",
    keyTakeaways: [
      "Decouples traversal algorithms from internal data structures (arrays, binary trees, linked lists, hash tables).",
      "Allows multiple independent cursors to traverse the same collection simultaneously without state conflicts.",
      "The ubiquitous foundation of modern `for-each` loops, Java Streams, Python Generators, and JavaScript Iterables."
    ],
    sections: [
      {
        heading: "1. Architectural Intent: Sequential Traversal Without Exposing Internal Data Structures",
        body: "A collection data structure can store elements in an array, a doubly-linked list, a B-tree, or a hash bucket array. If client code needs to iterate over the collection, exposing its internal node pointers or bucket indexes completely shatters data encapsulation. The Iterator pattern extracts traversal responsibility into a separate cursor object with a uniform interface (hasNext(), next()).",
        bullets: [
          "Encapsulation Preservation: Clients loop through elements without knowing whether storage is contiguous memory or a fragmented tree.",
          "Single Responsibility Principle: Traversal logic is separated from collection storage logic.",
          "Uniform Iteration Interface: A single client method can process elements from any iterable data structure polymorphically."
        ]
      },
      {
        heading: "2. Fail-Fast vs Fail-Safe Iteration & Concurrent Modification Mechanics",
        body: "In multi-threaded or dynamic environments, modifying a collection while an iterator is actively traversing it creates undefined behavior (e.g. skipping elements or reading deleted nodes). Java solves this with two canonical mechanisms: Fail-Fast (detects modifications via an internal modCount counter and throws ConcurrentModificationException immediately) and Fail-Safe / Snapshot (traverses a copy or memory snapshot, safe from concurrent mutations).",
        bullets: [
          "Fail-Fast (modCount): Checks expectedModCount == modCount on every call to next(); fails immediately if mutated.",
          "Fail-Safe (Snapshot): Used in CopyOnWriteArrayList and concurrent collections, iterating over an immutable snapshot of the backing array.",
          "Multiple Active Iterators: Because each iterator holds its own private cursor index, multiple threads or loops can traverse the same collection concurrently."
        ]
      },
      {
        heading: "3. Failure Modes: Cursor Desynchronization, Garbage Generation & Leaked Resources",
        body: "When iterating over large datasets or external resources (such as reading rows from a remote database cursor or reading lines from disk), failing to close the iterator can leak network sockets and file handles. Furthermore, allocating high-frequency short-lived iterator objects inside inner loops of game engines or high-frequency trading loops causes excessive Garbage Collection pauses.",
        bullets: [
          "Resource Handle Leaks: Database and file iterators must implement AutoCloseable to ensure cursor resources are released.",
          "Allocation Tax in Hot Loops: Creating new Iterator heap instances inside high-throughput tight loops can cause GC thrashing; prefer zero-allocation primitive iterators.",
          "Unsupported remove() Operations: Throwing UnsupportedOperationException if an iterator does not support mutation."
        ]
      },
      {
        heading: "4. Production Blueprint: Custom Memory-Mapped Binary File Iterator in Java 21",
        body: "The following production Java implementation showcases a custom Fail-Fast Iterator traversing a custom binary block collection with bounds checking and modification detection.",
        bullets: [
          "CustomIterator Contract: Standard hasNext() and next() operations.",
          "Concurrent Modification Guard: Verifies modCount to ensure collection integrity."
        ],
        codeSnippet: {
          title: "Production Custom Fail-Fast Iterator in Java 21",
          code: `public interface SimpleIterator<T> {
    boolean hasNext();
    T next();
}

public class MemoryBlockCollection<T> {
    private Object[] elements;
    private int size = 0;
    private int modCount = 0; // Modification tracking

    public MemoryBlockCollection(int capacity) {
        this.elements = new Object[capacity];
    }

    public void add(T item) {
        if (size >= elements.length) {
            elements = Arrays.copyOf(elements, elements.length * 2);
        }
        elements[size++] = item;
        modCount++;
    }

    public SimpleIterator<T> iterator() {
        return new FailFastIterator();
    }

    private class FailFastIterator implements SimpleIterator<T> {
        private int cursor = 0;
        private final int expectedModCount = modCount;

        @Override public boolean hasNext() {
            return cursor < size;
        }

        @SuppressWarnings("unchecked")
        @Override public T next() {
            if (modCount != expectedModCount) {
                throw new ConcurrentModificationException("Collection mutated during iteration!");
            }
            if (cursor >= size) {
                throw new NoSuchElementException();
            }
            return (T) elements[cursor++];
        }
    }
}`
        }
      }
    ],
    tradeOffs: [
      {
        option: "Iterator Pattern",
        pros: "Preserves encapsulation, allows polymorphic traversal, supports multiple concurrent cursors.",
        cons: "Slight memory and method-dispatch overhead compared to direct raw array indexing in low-level code.",
        bestFor: "Custom data collections, tree traversals, streaming database records, pagination APIs."
      },
      {
        option: "Direct Index Access (get(i))",
        pros: "Zero object allocation; fastest execution on raw primitive arrays.",
        cons: "Catastrophic O(N^2) performance when used on LinkedList structures; exposes internal indexing.",
        bestFor: "Fixed-size internal primitive arrays in performance-critical inner loops."
      },
      {
        option: "Visitor Pattern",
        pros: "Allows executing operations across heterogeneous node types in hierarchical trees.",
        cons: "More complex to write; requires double-dispatch.",
        bestFor: "Compiler Abstract Syntax Trees (ASTs)."
      }
    ],
    interviewTip: "In interviews, explain why `for (int i=0; i<list.size(); i++) { list.get(i); }` is an anti-pattern for LinkedLists (it degrades to O(N^2) complexity because get(i) traverses from the head every time!), whereas an Iterator executes in optimal O(N) by holding a direct pointer to the current node."
  },

  // 6. State (Intermediate)
  {
    id: "state",
    subtopicNumber: "3.6",
    title: "State Pattern",
    subtitle: "Allows an object to alter its behavior when its internal state changes. The object will appear to change its class.",
    readingTime: "9 min read",
    difficulty: "Intermediate",
    accent: "#ef4444",
    keyTakeaways: [
      "Models Finite State Machines (FSMs) by encapsulating state-dependent behaviors into distinct polymorphic state classes.",
      "Completely eradicates massive, error-prone switch-case blocks across domain entities.",
      "State transitions are handled cleanly either by the state classes themselves or by the context orchestrator."
    ],
    sections: [
      {
        heading: "1. Architectural Intent: Modeling Finite State Machines as Clean Polymorphic Objects",
        body: "Entities with complex operational lifecycles—such as Order, Document, TCP Connection, or Vending Machine—exhibit radically different behavior depending on their current state. In an Order lifecycle (Created -> Paid -> Shipped -> Delivered -> Cancelled), calling cancelOrder() is allowed in the Paid state, but illegal in the Shipped state. Implementing this via switch-case statements inside every single method results in unmaintainable spaghetti code. The State pattern encapsulates state-specific behaviors into polymorphic classes.",
        bullets: [
          "Single Responsibility Principle: Each state class encapsulates behaviors and transition rules specific to that state.",
          "Open/Closed Principle: Adding a new lifecycle state requires introducing a new class without modifying existing states.",
          "Eliminates State Conditional Flags: Eradicates dozens of boolean flags (isPaid, isShipped, isCancelled) scattered across the domain entity."
        ]
      },
      {
        heading: "2. Dynamic State Transitions & Separation of State-Specific Behaviors",
        body: "The Context maintains a reference to a State interface. When a client calls a method on the Context (e.g. order.ship()), the Context delegates to currentState.ship(). If the transition is valid, the current state transitions the Context to the new state instance (e.g. context.setState(new ShippedOrderState())). The object appears to change its class dynamically as its state changes.",
        bullets: [
          "Context-Driven vs State-Driven Transitions: In State-Driven transitions, concrete states know their successor states; in Context-Driven transitions, the context centrally manages transition rules.",
          "Shared Stateless States: If states hold no instance variables, state instances can be shared as immutable singletons across thousands of context entities.",
          "Strict Invariant Enforcement: Invalid actions throw illegal state exceptions naturally without sprawling conditional checks."
        ]
      },
      {
        heading: "3. Failure Modes: Circular Transition Coupling, State Explosion & Unhandled Transitions",
        body: "A frequent architectural hazard in State implementations is tight coupling between concrete state classes when states manage transitions directly (State A constructs new State B(), which constructs new State C()). This creates circular compilation dependencies. Furthermore, if the base State interface defines 15 operations, every single state class must implement all 15 methods—often throwing UnsupportedOperationException—unless sensible default base implementations are provided.",
        bullets: [
          "Circular Class Dependencies: Avoid hardcoding concrete successor classes; utilize state factories or context-directed transitions.",
          "State Explosion: If the system has 20 states and 20 events, class counts escalate rapidly; consider finite state machine libraries (Spring StateMachine, XState).",
          "Dangling State Side-Effects: If a state transition initiates an external RPC that fails, the context must safely roll back to its previous state."
        ]
      },
      {
        heading: "4. Production Blueprint: Enterprise Order Fulfillment State Machine in TypeScript",
        body: "The following production TypeScript implementation demonstrates an enterprise Order Fulfillment Finite State Machine with safe state transitions and strict invariant validation.",
        bullets: [
          "OrderState Interface: Declares allowed business actions.",
          "OrderContext: Holds current state and delegates lifecycle operations cleanly."
        ],
        codeSnippet: {
          title: "Production Order State Machine in TypeScript",
          code: `export interface OrderState {
  pay(context: OrderContext): void;
  ship(context: OrderContext): void;
  cancel(context: OrderContext): void;
  getStatus(): string;
}

export class OrderContext {
  private state: OrderState;

  constructor() {
    this.state = new CreatedState();
  }

  public setState(state: OrderState): void {
    console.log(\`[Transition] State changed to: \${state.getStatus()}\`);
    this.state = state;
  }

  public pay(): void { this.state.pay(this); }
  public ship(): void { this.state.ship(this); }
  public cancel(): void { this.state.cancel(this); }
  public getStatus(): string { return this.state.getStatus(); }
}

// Concrete State 1: Created
export class CreatedState implements OrderState {
  pay(ctx: OrderContext): void {
    console.log("[Payment] Payment authorized successfully.");
    ctx.setState(new PaidState());
  }
  ship(ctx: OrderContext): void {
    throw new Error("Cannot ship an order before payment.");
  }
  cancel(ctx: OrderContext): void {
    console.log("[Cancel] Order cancelled.");
    ctx.setState(new CancelledState());
  }
  getStatus(): string { return "CREATED"; }
}

// Concrete State 2: Paid
export class PaidState implements OrderState {
  pay(ctx: OrderContext): void {
    throw new Error("Order is already paid.");
  }
  ship(ctx: OrderContext): void {
    console.log("[Shipping] Waybill printed. Order dispatched.");
    ctx.setState(new ShippedState());
  }
  cancel(ctx: OrderContext): void {
    console.log("[Refund] Processing refund for cancelled order.");
    ctx.setState(new CancelledState());
  }
  getStatus(): string { return "PAID"; }
}

// Concrete State 3: Shipped
export class ShippedState implements OrderState {
  pay(ctx: OrderContext): void { throw new Error("Order is already paid and shipped."); }
  ship(ctx: OrderContext): void { throw new Error("Order has already been shipped."); }
  cancel(ctx: OrderContext): void { throw new Error("Cannot cancel order after dispatch."); }
  getStatus(): string { return "SHIPPED"; }
}

export class CancelledState implements OrderState {
  pay(ctx: OrderContext): void { throw new Error("Cannot pay cancelled order."); }
  ship(ctx: OrderContext): void { throw new Error("Cannot ship cancelled order."); }
  cancel(ctx: OrderContext): void { throw new Error("Order is already cancelled."); }
  getStatus(): string { return "CANCELLED"; }
}`
          }
        }
      ],
      tradeOffs: [
        {
          option: "State Pattern",
          pros: "Eliminates giant switch statements, encapsulates state-specific rules, makes transitions explicit.",
          cons: "Increases class count significantly; can be over-engineering for simple 2-state objects.",
          bestFor: "Order lifecycles, connection handshakes (TCP SYN/ACK), game player animations, document editorial workflows."
        },
        {
          option: "Enum with Switch Statements",
          pros: "Compact; keeps all transitions in a single file; simple for small state machines.",
          cons: "High cyclomatic complexity; adding a new state requires editing every single switch block.",
          bestFor: "Simple finite entities with 2-3 states and minimal unique behaviors."
        },
        {
          option: "Strategy Pattern",
          pros: "Swaps algorithms dynamically; strategies do not typically know about each other.",
          cons: "Does not model transitions between different algorithmic behaviors.",
          bestFor: "Interchangeable calculation strategies rather than lifecycle progression."
        }
      ],
      interviewTip: "Interviewers frequently ask candidates to contrast State vs Strategy. Highlight: 'While their UML class diagrams look almost identical, their architectural intents are fundamentally different. In Strategy, the client selects an independent algorithm to execute, and strategies have no awareness of each other. In State, the context object transitions dynamically through a set of states over time as events occur, modeling a Finite State Machine.'"
  },

  // 7. Chain of Responsibility (Intermediate)
  {
    id: "chain-of-responsibility",
    subtopicNumber: "3.7",
    title: "Chain of Responsibility Pattern",
    subtitle: "Passes requests along a chain of handlers; upon receiving a request, each handler decides either to process it or pass it to the next handler.",
    readingTime: "8 min read",
    difficulty: "Intermediate",
    accent: "#38bdf8",
    keyTakeaways: [
      "Decouples senders of a request from its receivers by giving multiple objects a chance to handle the request.",
      "Handlers are chained sequentially; a handler can short-circuit the pipeline (e.g., rejecting unauthorized requests) or decorate and forward it.",
      "Standard foundation for Servlet Filter chains, Express.js middleware, Spring Security interceptors, and ATM cash dispensing logic."
    ],
    sections: [
      {
        heading: "1. Architectural Intent: Decoupling Request Senders from Downstream Handlers",
        body: "When processing incoming requests in web servers or enterprise backends, hardcoding authorization checks, rate-limiting rules, caching, and input sanitization directly into a controller creates monolithic code that violates the Single Responsibility Principle. The Chain of Responsibility pattern allows you to compose standalone handler units into dynamic linear pipelines.",
        bullets: [
          "Single Responsibility Principle: Each handler class does one thing (e.g. rate limiting or authentication).",
          "Open/Closed Principle: You can inject new inspection or filtering handlers into the pipeline without modifying existing handlers.",
          "Short-Circuit Capability: Handlers can abort execution early if validation conditions fail."
        ]
      },
      {
        heading: "2. Linear Middleware Pipeline Execution & Short-Circuit Mechanics",
        body: "In a Chain of Responsibility, each handler maintains a reference to the next handler in the sequence. When handle(request) is invoked, the handler executes its local logic. If the request is invalid (e.g. invalid JWT), it short-circuits by returning an error response, stopping subsequent processing. If valid, it invokes next.handle(request).",
        bullets: [
          "Uniform Handler Interface: All stages implement the same base contract (e.g., setNext(), handle()).",
          "Dynamic Assembly: Middleware pipelines can be constructed dynamically per route or per tenant.",
          "Two-Way Pipelines: Handlers can execute pre-processing before delegating and post-processing after the chain returns."
        ]
      },
      {
        heading: "3. Failure Modes: Silent Dropped Requests, Circular Next Pointers & Stack Overflow",
        body: "A frequent bug in custom Chain of Responsibility implementations is the unhandled request scenario: if none of the handlers in the chain process the request and there is no terminal fallback handler, the request disappears silently without a response. Furthermore, if handlers are accidentally wired in a loop (A -> B -> A), execution triggers an infinite loop and StackOverflowError.",
        bullets: [
          "Unhandled Request Fallback: Always configure a terminal default handler that logs a warning or returns HTTP 404/500.",
          "Circular Wiring: Ensure pipeline assembly is strictly acyclic using directed graph validation during bootstrap.",
          "Call-Stack Depth: In synchronous recursive chains with hundreds of handlers, deep recursion can exhaust stack frames."
        ]
      },
      {
        heading: "4. Production Blueprint: Production Security & Rate Limiting Filter Chain in Java 21",
        body: "The following production Java implementation showcases an enterprise HTTP Middleware pipeline featuring authentication, token-bucket rate limiting, and input sanitization with clean short-circuiting.",
        bullets: [
          "RequestHandler Abstract Base: Provides fluent linkWith() chaining helper.",
          "AuthHandler, RateLimitHandler, SanitizerHandler: Modular pipeline stages."
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
        if (next == null) return true; // Reached end of chain successfully
        return next.handle(request);
    }
}

// Stage 1: Authentication
public class AuthHandler extends RequestHandler {
    @Override public boolean handle(HttpRequest request) {
        if (!"VALID_JWT_TOKEN".equals(request.token())) {
            System.out.println("401 Unauthorized: Invalid token");
            return false; // Short-circuit
        }
        return super.handle(request);
    }
}

// Stage 2: Rate Limiting
public class RateLimitHandler extends RequestHandler {
    private final AtomicInteger requestCount = new AtomicInteger();

    @Override public boolean handle(HttpRequest request) {
        if (requestCount.incrementAndGet() > 100) {
            System.out.println("429 Too Many Requests: Rate limit exceeded");
            return false; // Short-circuit
        }
        return super.handle(request);
    }
}`
        }
      }
    ],
    tradeOffs: [
      {
        option: "Chain of Responsibility",
        pros: "Decouples sender and receiver, easily reorder or inject new pipeline steps, enables early short-circuiting.",
        cons: "No guarantee that a request will be handled; can be hard to debug long recursive call chains.",
        bestFor: "HTTP middleware, authentication/authorization pipelines, logging filters, approval workflows."
      },
      {
        option: "Monolithic Controller",
        pros: "All checks visible sequentially in one method; easy to step-debug.",
        cons: "Violates Single Responsibility; highly coupled; impossible to reuse middleware across routes.",
        bestFor: "Simple scripts with 1-2 trivial validations."
      },
      {
        option: "Decorator Pattern",
        pros: "Wraps objects to enhance behavior transparently.",
        cons: "Decorators typically execute all layers and do not easily support short-circuit aborts.",
        bestFor: "Augmenting object functionality rather than sequential request filtering."
      }
    ],
    interviewTip: "In interviews, connect Chain of Responsibility to Servlet Filters and Express.js middleware: 'Each middleware handler can either process the request and call next(), or terminate the chain and return an error response immediately. This separation of concerns allows authentication, CORS, rate limiting, and logging to be applied declaratively.'"
  },

  // 8. Mediator (Advanced)
  {
    id: "mediator",
    subtopicNumber: "3.8",
    title: "Mediator Pattern",
    subtitle: "Defines an object that encapsulates how a set of objects interact, preventing them from referring to each other explicitly.",
    readingTime: "9 min read",
    difficulty: "Advanced",
    accent: "#a855f7",
    keyTakeaways: [
      "Replaces complex M:N tangled dependency networks with a clean 1:N hub-and-spoke star topology.",
      "Colleague objects communicate exclusively through the Mediator, knowing nothing about other colleague classes.",
      "The architectural foundation of Air Traffic Control towers, chat rooms, UI dialog form controllers, and CQRS in-process event dispatchers (MediatR)."
    ],
    sections: [
      {
        heading: "1. Architectural Intent: Taming M:N Spaghetti Dependencies via Centralized Coordination",
        body: "When multiple components interact with one another (such as a complex UI modal dialog containing checkboxes, buttons, text inputs, and drop-down menus), changes to one component often affect several others: checking 'Ship to different address' shows extra text inputs, validates postal codes, and recalculates taxes. If every widget communicates directly with every other widget, the system degrades into an unmaintainable M:N spaghetti mesh. The Mediator pattern centralizes all inter-component coordination into a single coordinator object.",
        bullets: [
          "Replaces Mesh with Star Topology: Transforms chaotic O(N^2) direct dependencies into O(N) connections to a central hub.",
          "Decouples Colleagues: Widgets or services only know about the Mediator; they have zero references to sibling components.",
          "Single Responsibility Principle: Complex multi-component interaction business rules are consolidated in one coordinator class."
        ]
      },
      {
        heading: "2. Hub-and-Spoke Topology & Loose Coupling Across Colleague Objects",
        body: "In a Mediator architecture, Colleague components hold a reference to the Mediator interface. When an event occurs (e.g. button.onClick()), the button simply notifies the mediator: mediator.notify(this, 'SUBMIT_CLICKED'). The Mediator encapsulates the intelligence: it reads the state of text inputs, disables the button, shows a spinner, and sends the payload. Neither the button nor the text fields know each other exist.",
        bullets: [
          "Event Notification: Colleagues emit events to the mediator via a standardized notify(sender, event) hook.",
          "Coordinated Orchestration: The mediator executes multi-component state synchronization.",
          "Reusability: Individual colleague components remain highly reusable because they are not coupled to specific UI layouts or peer components."
        ]
      },
      {
        heading: "3. Failure Modes: God-Object Monolithization & Hidden Event Churn",
        body: "The primary risk of the Mediator pattern is that the Mediator class can easily degenerate into a monolithic God Object. As more colleague widgets and complex rules are added, the mediator's notify() method balloons into thousands of lines of nested switch statements. Furthermore, if colleague reactions trigger secondary mediator events, cascading feedback loops can trigger infinite event cycles.",
        bullets: [
          "God Object Anti-Pattern: When a mediator grows too large, decompose it into smaller domain-specific sub-mediators.",
          "Feedback Loops: If the mediator updates Widget A, and Widget A emits a change event back to the mediator that updates Widget B, circular event churn can crash the UI.",
          "Tight Mediator Coupling: While colleagues are decoupled from each other, they are all tightly coupled to the Mediator."
        ]
      },
      {
        heading: "4. Production Blueprint: Enterprise Air Traffic Control & UI Dialog Coordinator in TypeScript",
        body: "The following production TypeScript implementation demonstrates an Air Traffic Control Mediator coordinating aircraft runways and takeoff clearances without aircraft communicating directly.",
        bullets: [
          "AirTrafficControlMediator Interface: Central coordination protocol.",
          "FlightColleague Base: Aircraft instances that communicate strictly through the tower."
        ],
        codeSnippet: {
          title: "Production Air Traffic Control Mediator in TypeScript",
          code: `export interface AirTrafficMediator {
  requestLanding(flightNumber: string): boolean;
  notifyRunwayCleared(flightNumber: string): void;
}

export abstract class Aircraft {
  constructor(protected mediator: AirTrafficMediator, public flightNumber: string) {}
  public abstract land(): void;
  public abstract clearRunway(): void;
}

// Concrete Colleague
export class CommercialFlight extends Aircraft {
  land(): void {
    const cleared = this.mediator.requestLanding(this.flightNumber);
    if (cleared) {
      console.log(\`[Flight \${this.flightNumber}] Landing touchdown confirmed.\`);
      this.clearRunway();
    } else {
      console.log(\`[Flight \${this.flightNumber}] Holding in holding pattern...\`);
    }
  }

  clearRunway(): void {
    console.log(\`[Flight \${this.flightNumber}] Runway vacated.\`);
    this.mediator.notifyRunwayCleared(this.flightNumber);
  }
}

// The Central Mediator
export class AirportControlTower implements AirTrafficMediator {
  private runwayOccupied: boolean = false;
  private holdingQueue: string[] = [];

  requestLanding(flightNumber: string): boolean {
    if (!this.runwayOccupied) {
      this.runwayOccupied = true;
      console.log(\`[Tower] Cleared \${flightNumber} for immediate landing.\`);
      return true;
    }
    console.log(\`[Tower] Runway busy. Queuing \${flightNumber}.\`);
    this.holdingQueue.push(flightNumber);
    return false;
  }

  notifyRunwayCleared(flightNumber: string): void {
    this.runwayOccupied = false;
    console.log(\`[Tower] Runway is now open.\`);
    if (this.holdingQueue.length > 0) {
      const nextFlight = this.holdingQueue.shift()!;
      console.log(\`[Tower] Calling \${nextFlight} from holding queue.\`);
      this.runwayOccupied = true;
    }
  }
}`
          }
        }
      ],
      tradeOffs: [
        {
          option: "Mediator Pattern",
          pros: "Reduces M:N mesh complexity to 1:N star topology; colleagues are decoupled and reusable.",
          cons: "The mediator itself risks becoming a bloated, unmaintainable God Object.",
          bestFor: "Air traffic control, UI modal form controllers, in-process CQRS command buses (MediatR), chat rooms."
        },
        {
          option: "Direct Colleague References",
          pros: "Direct and straightforward for tiny applications with only 2 fixed widgets.",
          cons: "Tangled spaghetti dependencies; impossible to modify or test one widget without instantiating all others.",
          bestFor: "Trivial 2-component interactions."
        },
        {
          option: "Observer Pattern",
          pros: "Colleagues publish events to an open bus without a central coordinator.",
          cons: "No central place to understand the overarching business workflow; event flows become opaque.",
          bestFor: "Pure broadcast notifications where publishers do not need to coordinate actions across subscribers."
        }
      ],
      interviewTip: "Distinguish Mediator vs Facade: 'Facade creates a simplified interface over a subsystem; communication is unidirectional from client to subsystem. Mediator centralizes multilateral bidirectional communication between sibling components, replacing an M:N mesh with a 1:N hub-and-spoke star topology.'"
  },

  // 9. Memento (Advanced)
  {
    id: "memento",
    subtopicNumber: "3.9",
    title: "Memento Pattern",
    subtitle: "Without violating encapsulation, captures and externalizes an object's internal state so that the object can be restored to this state later.",
    readingTime: "8 min read",
    difficulty: "Advanced",
    accent: "#f59e0b",
    keyTakeaways: [
      "Provides snapshot-and-restore capabilities while maintaining strict encapsulation: the internal state is hidden from all external classes including the Caretaker.",
      "The Originator creates and consumes Mementos; the Caretaker stores Mementos but cannot inspect or mutate their private internals.",
      "Essential for database savepoints, text editor checkpoint history, game save states, and transactional rollbacks."
    ],
    sections: [
      {
        heading: "1. Architectural Intent: Snapshotting Internal State Without Violating Encapsulation",
        body: "To implement undo, savepoints, or transaction rollback, an application needs to take a snapshot of an object's internal state. However, making all private fields public or exposing getters/setters completely destroys encapsulation: client code can manipulate internal fields, breaking business invariants. The Memento pattern resolves this paradox by letting the Originator serialize its private state into an opaque Memento object that no external class can read or alter.",
        bullets: [
          "Encapsulation Integrity: The Memento's internal state is completely invisible to the Caretaker; only the Originator has permission to unpack it.",
          "Originator: The domain object whose state is being tracked (e.g. TextEditor, Document).",
          "Caretaker: The history manager that stores a stack of Mementos (e.g. HistoryManager, UndoStack), treating them as opaque tokens."
        ]
      },
      {
        heading: "2. Originator, Caretaker & Opaque Memento Boundary Mechanics",
        body: "The elegance of Memento lies in the 'Wide vs Narrow' interface idiom. To the Caretaker, the Memento exposes a 'narrow' interface (often an empty marker interface or a metadata interface showing only timestamp and title). To the Originator, the Memento exposes a 'wide' interface granting full access to its internal state fields. In languages like Java or C++, this is enforced via inner classes or friend classes.",
        bullets: [
          "Narrow Interface: Exposed to the public Caretaker (e.g., getTimestamp(), getName()).",
          "Wide Interface: Private to the Originator class, providing direct access to raw internal state.",
          "Atomic Restoration: Invoking originator.restore(memento) instantaneously restores the complete internal object graph."
        ]
      },
      {
        heading: "3. Failure Modes: Massive Heap Memory Bloat & Leaky Mementos",
        body: "The primary challenge of Memento in production is memory consumption. If an Originator contains a 50MB image or document, and the Caretaker saves a full snapshot on every single keystroke, the JVM will run Out of Memory in minutes. Production systems mitigate this using incremental delta/diff snapshots, copy-on-write data structures, or compressing older snapshots.",
        bullets: [
          "Unbounded Snapshot Growth: Enforce bounded FIFO queues and disk offloading for historical mementos.",
          "Deep vs Shallow Snapshotting: If state objects reference mutable collections, the Memento must perform defensive deep copies during snapshot creation.",
          "Leaky Memento Mutation: Never expose public setters on Mementos; they must be strictly immutable."
        ]
      },
      {
        heading: "4. Production Blueprint: Incremental Diffing Document Snapshot Engine in Java 21",
        body: "The following production Java implementation showcases an enterprise Document Editor Memento system with private inner-class encapsulation and bounded caretaker history.",
        bullets: [
          "DocumentMemento: Opaque to the caretaker; fully accessible to DocumentEditor.",
          "DocumentHistory Caretaker: Manages undo stack with size limits."
        ],
        codeSnippet: {
          title: "Production Encapsulated Memento in Java 21",
          code: `// Narrow interface visible to Caretaker
public interface Memento {
    Instant getTimestamp();
    String getSummary();
}

// Originator
public class DocumentEditor {
    private String content = "";
    private int cursorPosition = 0;

    public void write(String text) {
        this.content += text;
        this.cursorPosition = this.content.length();
    }

    public String getContent() { return content; }

    // Snapshot state into opaque memento
    public Memento save() {
        return new EditorMemento(this.content, this.cursorPosition);
    }

    // Restore state from memento
    public void restore(Memento memento) {
        if (memento instanceof EditorMemento em) {
            this.content = em.content;
            this.cursorPosition = em.cursorPosition;
            System.out.printf("[Restore] Restored state from %s%n", em.getTimestamp());
        } else {
            throw new IllegalArgumentException("Unknown memento implementation");
        }
    }

    // Wide Interface encapsulated as private static class
    private static class EditorMemento implements Memento {
        private final String content;
        private final int cursorPosition;
        private final Instant timestamp = Instant.now();

        private EditorMemento(String content, int cursorPosition) {
            this.content = content;
            this.cursorPosition = cursorPosition;
        }

        @Override public Instant getTimestamp() { return timestamp; }
        @Override public String getSummary() { return content.substring(0, Math.min(content.length(), 20)) + "..."; }
    }
}`
        }
      }
    ],
    tradeOffs: [
      {
        option: "Memento Pattern",
        pros: "Preserves encapsulation, allows full state restoration, caretaker cannot corrupt state.",
        cons: "High memory consumption if snapshots are frequent and objects are large; cloning overhead.",
        bestFor: "Text editor history, game checkpoint saves, database transaction rollback points."
      },
      {
        option: "Command Pattern (with Inverse)",
        pros: "Stores only the operation diff rather than full snapshots; dramatically lower memory usage.",
        cons: "Requires implementing inverse operations for every action; mathematically hard for lossy operations.",
        bestFor: "Systems with discrete undoable operations (e.g. financial ledgers)."
      },
      {
        option: "Public Getters / Setters",
        pros: "Trivial to serialize to JSON.",
        cons: "Destroys encapsulation; leaks internal representation to external callers.",
        bestFor: "Stateless DTO data transfers."
      }
    ],
    interviewTip: "In interviews, emphasize the 'Narrow vs Wide Interface' concept: 'The beauty of Memento is that it solves state snapshotting without violating encapsulation. The Caretaker sees only a narrow marker interface, while the Originator accesses the wide interface via private inner classes to restore state.'"
  },

  // 10. Visitor (Advanced)
  {
    id: "visitor",
    subtopicNumber: "3.10",
    title: "Visitor Pattern",
    subtitle: "Represents an operation to be performed on the elements of an object structure, letting you define a new operation without changing the classes of the elements.",
    readingTime: "9 min read",
    difficulty: "Advanced",
    accent: "#a855f7",
    keyTakeaways: [
      "Enables adding new polymorphic operations to complex class hierarchies without modifying existing element classes.",
      "Implements Double Dispatch to bypass single-dispatch virtual method limitations in languages like Java, C++, and C#.",
      "Ubiquitous in compiler design (AST tree walking, type checkers, code generators) and document export engines (PDF, HTML, Markdown)."
    ],
    sections: [
      {
        heading: "1. Architectural Intent: Adding Operations to Complex Hierarchies Without Modifying Classes",
        body: "Consider a compiler or document engine with dozens of node types (Paragraph, Header, Table, CodeBlock). If you need to add operations—such as ExportToPDF, ExportToMarkdown, CountWordFrequency, and AuditAccessibility—adding methods to each node class violates the Open/Closed Principle and pollutes domain entities with formatting logic. The Visitor pattern extracts these operations into separate Visitor classes.",
        bullets: [
          "Open/Closed Principle: Introduce new operations across the entire class hierarchy by creating a new Visitor subclass without touching node classes.",
          "Single Responsibility Principle: Gathers related operations into a single cohesive Visitor class rather than spreading them across dozens of node files.",
          "Heterogeneous Data Traversal: Operates seamlessly across collections containing diverse, unrelated node types."
        ]
      },
      {
        heading: "2. Double Dispatch Mechanics & Virtual Method Table Resolution",
        body: "Most object-oriented languages (Java, C++, TypeScript) support Single Dispatch: the method executed at runtime depends only on the receiver object's dynamic type, not the parameter's dynamic type. If you have visitor.visit(element), the language resolves the method based on the compile-time type of element. Visitor circumvents this using Double Dispatch: 1) The client calls element.accept(visitor); 2) Inside accept(), the element calls visitor.visit(this), binding the exact concrete element type polymorphically.",
        bullets: [
          "Dispatch 1: element.accept(visitor) dynamically dispatches based on the concrete Element class.",
          "Dispatch 2: Inside accept(), visitor.visit(this) dynamically dispatches based on the concrete Visitor class, passing the strongly-typed 'this'.",
          "Type-Safe Execution: Eliminates ugly instanceof chains and runtime casting."
        ]
      },
      {
        heading: "3. Failure Modes: Cyclic Dependencies & The Pain of Adding New Element Types",
        body: "The Achilles' heel of the Visitor pattern is that while it makes adding new *operations* trivial, it makes adding new *element types* excruciatingly difficult. If you introduce a new element class (e.g. VideoBlock), the Visitor base interface must add visitVideoBlock(VideoBlock), instantly breaking every single existing visitor class in the codebase.",
        bullets: [
          "Element Hierarchy Rigidity: Never use Visitor if the element class hierarchy is changing frequently; only use it when the element hierarchy is stable.",
          "Encapsulation Compromise: Visitors often require access to private/protected fields of elements to perform their tasks, forcing elements to expose public getters.",
          "Cyclic Dependencies: Element interfaces must import the Visitor interface, and the Visitor interface must import all Element classes, creating mutual compilation cycles."
        ]
      },
      {
        heading: "4. Production Blueprint: AST Expression Evaluator & Document Exporter in Java 21",
        body: "The following production Java implementation demonstrates an Abstract Syntax Tree (AST) Document Exporter using Visitor with full double dispatch.",
        bullets: [
          "DocumentVisitor: Declares visit() overloads for Paragraph and Heading nodes.",
          "HtmlExportVisitor & MarkdownExportVisitor: Specialized rendering engines."
        ],
        codeSnippet: {
          title: "Production AST Document Visitor in Java 21",
          code: `public interface DocumentVisitor {
    void visit(HeadingNode node);
    void visit(ParagraphNode node);
}

// Element Interface
public interface DocumentNode {
    void accept(DocumentVisitor visitor); // The First Dispatch
}

// Concrete Element 1
public record HeadingNode(int level, String text) implements DocumentNode {
    @Override public void accept(DocumentVisitor visitor) {
        visitor.visit(this); // The Second Dispatch
    }
}

// Concrete Element 2
public record ParagraphNode(String text) implements DocumentNode {
    @Override public void accept(DocumentVisitor visitor) {
        visitor.visit(this); // The Second Dispatch
    }
}

// Concrete Visitor: HTML Exporter
public class HtmlExportVisitor implements DocumentVisitor {
    private final StringBuilder html = new StringBuilder();

    @Override public void visit(HeadingNode node) {
        html.append(String.format("<h%d>%s</h%d>%n", node.level(), node.text(), node.level()));
    }

    @Override public void visit(ParagraphNode node) {
        html.append(String.format("<p>%s</p>%n", node.text()));
    }

    public String getHtml() { return html.toString(); }
}`
        }
      }
    ],
    tradeOffs: [
      {
        option: "Visitor Pattern",
        pros: "Trivial to add new operations across all nodes; clean separation of concerns; enforces Double Dispatch.",
        cons: "Extremely painful to add new element classes; requires element classes to expose internal state.",
        bestFor: "Compilers, AST evaluators, document format converters (HTML/PDF/Markdown), complex tax/audit rules."
      },
      {
        option: "Adding Methods to Elements Directly",
        pros: "Simple and intuitive when only 1-2 operations exist.",
        cons: "Pollutes domain entities with formatting/export logic; violates Open/Closed Principle.",
        bestFor: "Small, homogeneous class hierarchies."
      },
      {
        option: "Pattern Matching (Java 21 switch / TypeScript)",
        pros: "Modern language alternative: switch over sealed interfaces without double-dispatch boilerplate.",
        cons: "Does not separate concerns into distinct pluggable visitor objects as cleanly in older codebases.",
        bestFor: "Modern Java 21 sealed hierarchies and TypeScript union types."
      }
    ],
    interviewTip: "In interviews, explain Double Dispatch clearly: 'Java supports single dispatch: polymorphic calls resolve only on the dynamic type of the object receiving the call, not on argument types. Visitor simulates double dispatch by having the element call `visitor.visit(this)`, ensuring the compiler binds both the concrete visitor and concrete element at runtime without `instanceof` checks.'"
  },

  // 11. Interpreter (Expert)
  {
    id: "interpreter",
    subtopicNumber: "3.11",
    title: "Interpreter Pattern",
    subtitle: "Given a language, defines a representation for its grammar along with an interpreter that uses the representation to interpret sentences in the language.",
    readingTime: "10 min read",
    difficulty: "Expert",
    accent: "#f59e0b",
    keyTakeaways: [
      "Defines an Abstract Syntax Tree (AST) where terminal and non-terminal grammar rules are represented by classes.",
      "Allows evaluating domain-specific languages (DSLs), mathematical formulas, SQL-like query filters, or JSON path expressions.",
      "For complex grammars, dedicated parser generators (ANTLR, Lex/Yacc) are preferred over manual GoF Interpreter class trees."
    ],
    sections: [
      {
        heading: "1. Architectural Intent: Defining Grammars & Evaluating Domain-Specific Languages",
        body: "Many enterprise systems require users to define dynamic business rules at runtime—such as fraud detection filters ('riskScore > 80 AND (country != US OR transactionAmount > 5000)'), SQL-like search queries, or promotion discount rules. Hardcoding these rules into code requires continuous redeployment. The Interpreter pattern defines a formal grammar for the language and constructs an Abstract Syntax Tree (AST) where each grammar rule is represented by a class.",
        bullets: [
          "Grammar as Class Tree: Each production rule in the formal language grammar maps directly to a class in the tree.",
          "Abstract Syntax Tree (AST): Sentences in the language are parsed into composite tree structures for evaluation.",
          "Dynamic Domain Rules: Allows non-engineers to define dynamic rules in a simple DSL without recompiling the application."
        ]
      },
      {
        heading: "2. Terminal vs Non-Terminal Expressions & AST Traversal",
        body: "The Interpreter pattern divides grammar expressions into two distinct categories: 1) Terminal Expressions, which represent the literal leaves of the AST (such as a string literal, number, or variable reference that evaluates directly against the Context); and 2) Non-Terminal Expressions, which represent operations combining multiple sub-expressions (such as AndExpression, OrExpression, AddExpression). The interpret(Context) method evaluates the tree recursively.",
        bullets: [
          "Context: Holds global state, input variables, and evaluation environment.",
          "TerminalExpression: Leaf nodes that evaluate directly without recursion.",
          "NonTerminalExpression: Branch nodes that recursively invoke interpret() on child expressions and combine results."
        ]
      },
      {
        heading: "3. Failure Modes: Performance Degradation on Deep ASTs & When to Use ANTLR",
        body: "The primary limitation of the Gang of Four Interpreter pattern is that it does NOT define how to parse text into the AST—it only defines how to represent and execute the AST once constructed. Writing manual recursive descent parsers for complex grammars is error-prone. Furthermore, deep recursive AST traversal introduces heavy call-stack overhead and GC allocation. For non-trivial grammars, production architectures use parser generators like ANTLR or compile to bytecode (ByteBuddy/JASM).",
        bullets: [
          "Parsing vs Interpreting: GoF Interpreter addresses only execution, not lexing or parsing.",
          "Grammar Complexity Limits: For grammars with more than 10-15 rules, the class hierarchy becomes unmanageable; use ANTLR or Lex/Yacc instead.",
          "Stack Overflow on Deep Trees: Highly nested expressions can trigger StackOverflowError; convert to iterative stack evaluation if expressions are unbounded."
        ]
      },
      {
        heading: "4. Production Blueprint: Production Boolean Rule Engine & Query Filter in TypeScript",
        body: "The following production TypeScript implementation demonstrates an enterprise Dynamic Fraud Rule Engine evaluating complex boolean ASTs.",
        bullets: [
          "Expression Interface: Core interpret() contract accepting a context dictionary.",
          "Terminal & Non-Terminal Nodes: VariableExpression, ComparisonExpression, AndExpression, OrExpression."
        ],
        codeSnippet: {
          title: "Production Rule Engine Interpreter in TypeScript",
          code: `export interface Expression {
  interpret(context: Record<string, any>): boolean;
}

// Terminal Expression: Checks variable equality or threshold
export class ComparisonExpression implements Expression {
  constructor(
    private readonly field: string,
    private readonly operator: ">" | "<" | "==",
    private readonly value: number
  ) {}

  interpret(context: Record<string, any>): boolean {
    const actual = context[this.field];
    if (actual === undefined) return false;
    switch (this.operator) {
      case ">": return actual > this.value;
      case "<": return actual < this.value;
      case "==": return actual === this.value;
    }
  }
}

// Non-Terminal Expression: Logical AND
export class AndExpression implements Expression {
  constructor(private left: Expression, private right: Expression) {}

  interpret(context: Record<string, any>): boolean {
    return this.left.interpret(context) && this.right.interpret(context);
  }
}

// Non-Terminal Expression: Logical OR
export class OrExpression implements Expression {
  constructor(private left: Expression, private right: Expression) {}

  interpret(context: Record<string, any>): boolean {
    return this.left.interpret(context) || this.right.interpret(context);
  }
}

// Usage Example
// Rule: (amount > 1000 AND riskScore > 75) OR isBlacklisted == 1
const fraudRule = new OrExpression(
  new AndExpression(
    new ComparisonExpression("amount", ">", 1000),
    new ComparisonExpression("riskScore", ">", 75)
  ),
  new ComparisonExpression("isBlacklisted", "==", 1)
);`
          }
        }
      ],
      tradeOffs: [
        {
          option: "Interpreter Pattern",
          pros: "Simple to implement for small domain-specific languages; dynamic rule evaluation at runtime.",
          cons: "Inefficient for complex grammars; creates large class trees; does not include text parsing.",
          bestFor: "Dynamic rule engines, boolean filter expressions, simple math formula evaluators."
        },
        {
          option: "Parser Generators (ANTLR / Lex-Yacc)",
          pros: "Industry standard for complex grammars, generates optimized ASTs and parsers automatically.",
          cons: "Requires external build tools, learning curve for grammar definition files (.g4).",
          bestFor: "Full programming languages, SQL parsers, complex query languages."
        },
        {
          option: "JavaScript eval() / Script Engine",
          pros: "Evaluates arbitrary code strings out of the box.",
          cons: "Massive security risk (code injection / RCE); slow performance; impossible to sandbox reliably.",
          bestFor: "Never recommended for untrusted user inputs in production backends."
        }
      ],
      interviewTip: "In system design and architecture interviews, be candid about the Interpreter pattern's limitations: 'The GoF Interpreter pattern is great for small, stable Domain-Specific Languages (DSLs) like custom boolean filtering or math expressions. However, for real-world enterprise query languages or SQL parsers, manual GoF AST classes become unmanageable. In production, I would use a dedicated parser generator like ANTLR or compile the expressions to JVM bytecode.'"
  }
];

// Merge with diagram data
const enrichedSubtopics = ORDERED_BEHAVIORAL_PATTERNS.map(p => {
  const diag = diagramMap[p.id] || {};
  return {
    ...p,
    ascii: diag.ascii || "",
    blockNodes: diag.blockNodes || [],
    blockConns: diag.blockConns || [],
    flowNodes: diag.flowNodes || [],
    flowConns: diag.flowConns || []
  };
});

const BEHAVIORAL_PATTERNS = {
  id: "behavioral-patterns",
  topicNumber: 3,
  title: "3. Behavioral Patterns",
  description: "Algorithms, communication, and assignment of responsibilities between objects: Strategy, Observer, Command, Template Method, Iterator, State, Chain of Responsibility, Mediator, Memento, Visitor, and Interpreter.",
  subtopics: enrichedSubtopics
};

const targetPath = path.join(__dirname, 'designPatternsMod3.js');
const fileContent = `/* eslint-disable @typescript-eslint/no-require-imports */\n\nconst BEHAVIORAL_PATTERNS = ${JSON.stringify(BEHAVIORAL_PATTERNS, null, 2)};\n\nmodule.exports = { BEHAVIORAL_PATTERNS };\n`;

fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log('Successfully enriched all 11 Behavioral Patterns in designPatternsMod3.js!');
