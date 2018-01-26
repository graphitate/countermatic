// storage controller
const StorageCtrl = (function(){
  
  // local storage key
  const lsKey = 'items';

  // get items from local storage
  // return the string
  const getAllItemsInStorage = function(){
    const items = localStorage.getItem(lsKey);
    return items;
  }

  return {
    storeItemToStorage: function(item){
      let items;
      localStorage.getItem(lsKey);
      // check for items in local storage
      if(localStorage.getItem(lsKey) === null){
        // no items in ls
        items = [];
        items.push(item);
        // set ls 
        localStorage.setItem(lsKey, JSON.stringify(items));
      } else {
        // items already exists in ls
        items = JSON.parse(getAllItemsInStorage());
        items.push(item);
        localStorage.setItem(lsKey, JSON.stringify(items));
      }
    },
    getItemsInStorage: function(){
      let items;
      if(localStorage.getItem(lsKey) === null){
        // no items in ls
        items = [];
      } else {
        items = JSON.parse(getAllItemsInStorage());
      }
      return items;
    },
    updateItemInStorage: function(item){
      // update the item in ls
      const storedItems = JSON.parse(getAllItemsInStorage());
      storedItems.forEach(storedItem => {
        if(storedItem.id === item.id){
          storedItem.name = item.name;
          storedItem.calories = item.calories;
        }
      });
      // persist
      localStorage.setItem(lsKey, JSON.stringify(storedItems));
    },
    deleteItemInStorage: function(itemId){
      // use the item Id to delete the item from ls
      const allItems = JSON.parse(getAllItemsInStorage());
      const newItems = allItems.filter(item => item.id !== itemId);
      // persist
      localStorage.setItem(lsKey, JSON.stringify(newItems));
    },
    deleteAllItemsInStorage: function(){
      // remove all items in local storage
      localStorage.removeItem(lsKey);
    }
  }
})();

// Item controller
const ItemCtrl = (function(){
  // Item constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State / private
  const data = {
    // items: [
    //   {id:0, name:'Steak Dinner', calories: 1200},
    // ],
    items: StorageCtrl.getItemsInStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // Public methods
  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(name, calories){
      let ID;
      if (data.items.length > 0) {
        // add 1 to the largest current id
        ID = data.items[data.items.length-1].id + 1;
      } else {
        ID = 0;
      }
      // calories to number from string
      calories = parseInt(calories);
      // create the new item
      const newItem = new Item(ID, name, calories);
      // push to data structure
      data.items.push(newItem);
      return newItem;
    },
    checkName: function(searchName){
      // search through the existing names and check if duplicate
      let valid = true;
      data.items.forEach(item =>{
        if (item.name.toLowerCase() === searchName.toLowerCase()){
          valid = false;
        }
      });
      return valid;
    },
    getTotalCalories: function(){
      // sum the total calories in the data
      let total = 0;
      data.items.forEach(item => {
        total += parseInt(item.calories);
      });
      return total;
    },
    getItemById: function(id){
      // get the item with the id
      const item = data.items.filter(item => {
        return item.id === id;
      });
      return item[0];
    },
    getCurrentItem: function(){
      // return the current item 
      return data.currentItem;
    },
    setCurrentItem: function(item){
      // set the current item
      data.currentItem = item;
    },
    updateItem: function(name, calories){
      // update the item in the data.items array
      calories = parseInt(calories);
      // use the id to update the data.items array
      let updatedItem = null;
      data.items.forEach(item => {
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          updatedItem = item;
        } 
      });
      this.setCurrentItem(null);
      return updatedItem;
    },
    deleteCurrentItem: function(){
      // delete the current item from data.items
      let newItems = [];
      newItems = data.items.filter(item => {
        if(item.id !== data.currentItem.id){
          return item;
        }
      });
      data.items = newItems;
      const currentItem = data.currentItem;
      data.currentItem = null; 
      return currentItem;
    },
    setTotalCalories: function(totalCalories){
      data.totalCalories = totalCalories;
    },
    clearAllItems: function(){
      // clear all the data 
      data.items = [];
      this.setCurrentItem(null);
      this.setTotalCalories(0);
    },
    logData: function(){
      return data;
    }
  }
})();

// UI Controller
const UICtrl = (function(){
  // refs to html id selectors
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addButton: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    addBtn:'.add-btn',
    updateBtn:'.update-btn',
    deleteBtn:'.delete-btn',
    backBtn:'.back-btn',
    clearBtn: '.clear-btn'
  }

  // private function to generate list item
  const makeListItem = function(item){
    const li = document.createElement('li');
    li.className = 'collection-item';
    li.id = `id-${item.id}`;
    const html = `<strong>${item.name}: </strong><em>${item.calories} calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
    li.innerHTML = html;
    return li;
  }

  // public methods
  return {
    setAppName: function(appName){
      // set the app name
      document.querySelector('.brand-logo').innerText = appName;
    },
    populateItemList: function(items){
      // iterate through items 
      const itemList = document.querySelector(UISelectors.itemList); 
      items.forEach(item => {
        // insert li into itemList
        itemList.insertAdjacentElement('beforeend', makeListItem(item));
      });
    },
    hideItemList: function(){
      // hide the item list
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showItemList: function(){
      // show the item list
      const itemList = document.querySelector(UISelectors.itemList);
      if (itemList.style.display === 'none') {
        document.querySelector(UISelectors.itemList).style.display = 'block';
      }
    },
    getSelectors: function(){
      return UISelectors;
    },
    getItemInput: function(){
      // the value comes from the form
      return {
        name:document.querySelector(UISelectors.itemNameInput).value,
        calories:document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item){
      // show the item list
      this.showItemList();
      // add the list item to the list in the UI
      const ul = document.querySelector(UISelectors.itemList);
      ul.insertAdjacentElement('beforeend', makeListItem(item));
    },
    updateItemList: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // loop through nodelist - convert to array
      listItems = Array.from(listItems);
      listItems.forEach(listItem => {
        const itemId = listItem.getAttribute('id');
        if(itemId === `id-${item.id}`){
          // create the li - using private method
          const newLi = makeListItem(item);
          // update the dom
          document.querySelector(`#${itemId}`).innerHTML = newLi.innerHTML;
        }
      });
    },
    removeListItem: function(item){
      // get the list item
      const deleteItem = document.querySelector(`#id-${item.id}`);
      deleteItem.remove();
      // if no more items in the list - hide the list
      const itemListCount = document.querySelectorAll(UISelectors.listItems).length;
      if(itemListCount === 0) {
        this.hideItemList();
      }
    },
    removeAllListItems: function(){
      // get the list item and empty all child nodes
      let listItems = document.querySelector(UISelectors.itemList).childNodes;
      // convert from nodelist to array of nodes
      listItems = Array.from(listItems);
      // remove each node from array
      listItems.forEach(listItem => {
        listItem.remove();
      });
      // hide the items list - no items
      this.hideItemList();
    },
    displayTotalCalories: function(calories){
      document.querySelector(UISelectors.totalCalories).innerText = calories;
    },
    displayCurrentItem: function(){
      // displays the current state item
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = parseInt(ItemCtrl.getCurrentItem().calories);
      // show the edit state
      UICtrl.showEditState();
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function(){
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none'; 
    }
  }
})();

// App controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){

  // load event listeners
  const loadEventListeners = function(){
    
    // get the html selectors
    const UISelectors = UICtrl.getSelectors();
    
    // add item event
    document.querySelector(UISelectors.addButton).addEventListener('click', itemAddSubmit);

    // disable submit form on enter - disable the enter key
    document.addEventListener('keypress', (e) => {
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    // edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // update item button
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // back button click
    document.querySelector(UISelectors.backBtn).addEventListener('click', leaveEditState);

    // delete button click
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // clear all button click
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  }

  // Event Handler functions
  const itemAddSubmit = function(e){
    // get the item submitted via the UI controller
    const itemInput = UICtrl.getItemInput();

    if (itemInput.name !== '' && itemInput.calories !== ''){
      // add the item to the state data

      // check for existing name
      const validName = ItemCtrl.checkName(itemInput.name);     

      if (!validName) {
        console.log('Name already exists!');
      } else {
        // add new item 
        const newItem = ItemCtrl.addItem(itemInput.name, itemInput.calories);

        // add item to UI list
        UICtrl.addListItem(newItem);

        // get the total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // display total calories
        UICtrl.displayTotalCalories(totalCalories);

        // store the item in local storage
        StorageCtrl.storeItemToStorage(newItem);

        // clear the form fields
        UICtrl.clearInput();

      }     
    }
  
    e.preventDefault();
  }

  // edit the item
  const itemEditClick = function(e){
    const item = e.target;
    if(item.classList.contains('edit-item')){
      // get the item id
      const itemId = parseInt(item.parentElement.parentElement.id.split('-')[1]);
      // loop through the data items by the id
      const itemToEdit = ItemCtrl.getItemById(itemId);
      // set the current item property
      ItemCtrl.setCurrentItem(itemToEdit);
      // show the current item in the form
      UICtrl.displayCurrentItem();
    }
  }

  // update the item
  const itemUpdateSubmit = function(e){
    const input = UICtrl.getItemInput();
    // update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // local storage
    StorageCtrl.updateItemInStorage(updatedItem);

    // update the item list with the updated item
    UICtrl.updateItemList(updatedItem);

    // get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // display the total calories
    UICtrl.displayTotalCalories(totalCalories);

    // clear the edit state
    UICtrl.clearEditState();

  }

  // leave the edit state
  const leaveEditState = function(e){
    UICtrl.clearEditState();
  }

  // delete the current item
  const itemDeleteSubmit = function(e){
    // remove the current item
    const item = ItemCtrl.deleteCurrentItem();
    UICtrl.removeListItem(item);

    // persist the data
    StorageCtrl.deleteItemInStorage(item.id);

    // get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    
    // display the total calories
    UICtrl.displayTotalCalories(totalCalories);

    // clear the edit state
    UICtrl.clearEditState();

    //e.preventDefault();
  }

  // clear all data
  const clearAllItemsClick = function(){
    // delete all items from data structure
    ItemCtrl.clearAllItems();

    // remove all items from local storage
    StorageCtrl.deleteAllItemsInStorage();

    // reset the UI
    UICtrl.removeAllListItems();
    // get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // display the total calories
    UICtrl.displayTotalCalories(totalCalories);
    // clear the edit state
    UICtrl.clearEditState();

  }


  return {
    // Public methods
    // runs when the app is initialized
    // gets items from the items controller
    // UI displays the items
    init: function(){
      // set app name
      UICtrl.setAppName('GMatic');

      // set the initial state of the UI
      UICtrl.clearEditState();

      // fetch items from data structure
      const items = ItemCtrl.getItems();
      // check if any items
      if (items.length === 0){
        UICtrl.hideItemList();
      } else {
        // populate list with items
        UICtrl.populateItemList(items);

        // get the total calories
        const totalCalories = ItemCtrl.getTotalCalories();
      
        // display total calories
        UICtrl.displayTotalCalories(totalCalories);

      }

      // load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, StorageCtrl, UICtrl);


// initialize app
App.init();