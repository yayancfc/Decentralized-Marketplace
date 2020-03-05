pragma solidity ^0.5.0; // Solidity Version 0.5.0

// Inherit Escrow from another local contract
import "/Escrow.sol";

//membuat contract
contract EcommerceStore {

    // Create ennumerated type with two members for product condition
    enum ProductCondition { New, Old }

    // ProductIndex is used to identify products
    uint public ProductIndex;
    
    uint public ProductStatus; //0= available, 1=order, 2=process order, 3 = order delivered, 4 = order completed

    address public arbiter;
    // Product structure.
    struct Product {
        uint id;
        string name;
        string category;
        uint price;
        ProductCondition condition;
        address buyer;
        string desc; 
        string imgLink;  // Hash of Image uploaded to IPFS.
        address seller;
        uint status;
    }

    event LogCurrentAccount(address currentAccount);

    constructor(address _arbiter) public {
        // Initialize ProductIndex to zero.
        ProductIndex = 0;
        ProductStatus = 0;
        arbiter = _arbiter;
        emit LogCurrentAccount(msg.sender);
    }

    mapping(address => mapping(uint => Product)) stores;

    mapping(uint => address payable) productIdinStore;

    // For each product what is the address of the Escrow
    mapping(uint => address) productEscrow;

    // Add product to the blockchain
    function addProduct( string memory _name,string memory _category, uint _price, uint _condition, string memory _desc, string memory _imgLink) public {
        // Increment the productIndex for every product. This variable is stored as id in the product structure
        ProductIndex += 1;

        // Create the product structure
        Product memory product = Product(ProductIndex, _name, _category, _price, ProductCondition(_condition), address(0), _desc, _imgLink, msg.sender, ProductStatus );
        stores[msg.sender][ProductIndex] = product;
        productIdinStore[ProductIndex] = msg.sender;
        emit LogCurrentAccount(msg.sender);
    }


    // Getter function which returns product details given a product id.
    function getProduct(uint _id) public view returns(uint, string memory, string memory, uint, ProductCondition, address, string memory, string memory, address, uint) {
        Product memory product = stores[productIdinStore[_id]][_id];
        return (product.id, product.name, product.category, product.price, product.condition, product.buyer, product.desc, product.imgLink, product.seller, product.status);
    }

    // Buy a product using product id.
    function buy(uint _id) payable public {
      Product memory product = stores[productIdinStore[_id]][_id];
      require(msg.value >= product.price);
      // We assigned 0x0000...000 (zero-account) as buyer value to state the
      // product is not already purchased
      require(product.buyer == address(0));
      product.buyer = msg.sender;
      product.status = 1;
      stores[productIdinStore[_id]][_id] = product;
      Escrow escrow = (new Escrow).value(msg.value)(_id, msg.sender, productIdinStore[_id], arbiter);
      productEscrow[_id] = address(escrow);
      emit LogCurrentAccount(msg.sender);
    }

    function escrowInfo(uint _id) view public returns (address, address, address, bool, uint, uint) {
      return Escrow(productEscrow[_id]).escrowInfo();
    }

    function releaseAmountToSeller(uint _id) public {
      Product memory product = stores[productIdinStore[_id]][_id];
      product.status += 1;
      stores[productIdinStore[_id]][_id] = product;
      
      Escrow(productEscrow[_id]).releaseAmountToSeller(msg.sender);
    }

    function refundAmountToBuyer(uint _id) public {
      Escrow(productEscrow[_id]).refundAmountToBuyer(msg.sender);
    }

}