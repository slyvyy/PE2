// Base class
class Base {
    // Base class constructor
    public Base() {
        System.out.println("Base class constructor called");
    }
    
    // Method in base class
    public void baseMethod() {
        System.out.println("Base class method called");
    }
}

// Subclass extending base class
class Subclass extends Base {
    // Subclass constructor
    public Subclass() {
        // Calling base class constructor using super
        super();
        System.out.println("Subclass constructor called");
    }
    
    // Method in subclass calling method from base class using super
    public void subclassMethod() {
        // Calling base class method using super
        super.baseMethod();
        System.out.println("Subclass method called");
    }
}


public class Main {
    public static void main(String[] args) {
        Subclass obj = new Subclass();
        
        obj.subclassMethod();
    }
}
