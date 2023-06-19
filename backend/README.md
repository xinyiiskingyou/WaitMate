- [1. Interface specifications](#1-interface-specifications)
    - [1.1. Input/Output types](#11-inputoutput-types)
    - [1.2. Interface](#12-interface)


# 1. Interface specifications
## 1.1. Input/Output types

<table>
  <tr>
    <th>Variable name</th>
    <th>Type</th>
  </tr>
  <tr>
    <td> contains substring <b>name</b></td>
    <td>string</td>
  </tr>
  <tr>
    <td> named exactly <b>status</b></td>
    <td>string</td>
  </tr>
  <tr>
    <td> named exactly <b>description</b></td>
    <td>string</td>
  </tr>
  <tr>
    <td> named exactly <b>price</b></td>
    <td>float</td>
  </tr>
  <tr>
    <td> named exactly <b>amount</b></td>
    <td>integer</td>
  </tr>
  <tr>
    <td> named exactly <b>seat_capacity</b></td>
    <td>integer</td>
  </tr>
  <tr>
    <td>has suffix <b>id</b></td>
    <td>integer</td>
  </tr>
  <tr>
    <td>has has prefix <b>is_</b></td>
    <td>boolean</td>
  </tr>
  <tr>
    <td>has prefix <b>time_</b></td>
    <td>integer (unix timestamp), [check this out](https://www.tutorialspoint.com/How-to-convert-Python-date-to-Unix-timestamp)</td>
  </tr>
  <tr>
    <td>(outputs only) named exactly <b>tables</b></td>
    <td>List of dictionaries, where each dictionary contains types { table_id, status }</td>
  </tr>
  <tr>
    <td>(outputs only) name exactly <b>menu_items</b></td>
    <td>List of dictionaries, where each dictionary contains types { name, price, img, amount }</td>
  </tr>
  <tr>
    <td>(outputs only) named exactly <b>category</b></td>
    <td>List of dictionaries, where each dictionary contains types { name, menu_items }</td>
  </tr>
  <tr>
    <td>(outputs only) named exactly <b>categories</b></td>
    <td> List of dictionaries, where each dictionary contains types of category
  <tr>
    <td>(outputs only) named exactly <b> order </b></td>
    <td>List of dictionaries, where each dictionary contains types { name, amount }</td>
  </tr>
  <tr>
    <td>(outputs only) named exactly <b> orders </b></td>
    <td>List of dictionaries, where each dictionary contains types { table_id, *order* }</td>
  </tr>
</table>

## 1.2. Interface


<table>
  <tr>
    <th>Name & Description</th>
    <th>HTTP Method</th>
    <th style="width:18%">Data Types</th>
    <th style="width:32%">Exceptions</th>
  </tr>
  <tr>
    <td><code>menu/category/add</code><br /><br />
    Add new category to the menu.
    </td>
    <td style="font-weight: bold; color: blue;">GET</td>
    <td><b>Parameters:</b><br /><code>{ cat_name: string }</code><br /><br /><b>Return Type:</b><br /><code>{ }</code></td>
    <td>
      <b>InputError</b> when any of:
      <ul>
        <li>category name is already exist</li>
        <li>length of cat_name is not between 1 and 15 characters inclusive</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>menu/category/update/order</code><br /><br />Update the order of menu categories.</td>
    <td style="font-weight: bold; color: blue;">PUT</td>
    <td><b>Parameters:</b><br /><code>{ old_id, new_id, categories }</code><br /><br /><b>Return Type:</b><br /><code>{}</code></td>
    <td><b>InputError</b> when any of:
      <ul>
        <li>old_id or new_id is not valid</li>
      </ul></td>
  </tr>
  <tr>
    <td><code>menu/category/update/name</code><br /><br />Update the name of menu categories.</td>
    <td style="font-weight: bold; color: blue;">PUT</td>
    <td><b>Parameters:</b><br /><code>{ categories, old_name, new_name }</code><br /><br /><b>Return Type:</b><br /><code>{}</code></td>
    <td><b>InputError</b> when any of:
      <ul>
        <li>old_name is not valid</li>
        <li>length of new_name is not between 1 and 15 characters inclusive</li>
      </ul></td>
  </tr>
  <tr>
    <td><code>menu/item/add</code><br /><br />Add new menu items with titles, descriptions, ingredients, category, and cost to the menu</td>
    <td style="font-weight: bold; color: blue;">POST</td>
    <td><b>Parameters:</b><br /><code>{ category }</code><br /><br /><b>Return Type:</b><br /><code>{ }</code></td>
    <td>
      <b>InputError</b> when:
      <ul>
        <li>category is not exist</li>
      </ul>
      <b>AccessError</b> when:
      <ul>
        <li>category is valid and the menu item has been added </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>menu/item/remove</code><br /><br />Remove existing menu items from the menu.</td>
    <td style="font-weight: bold; color: green;">DELETE</td>
    <td><b>Parameters:</b><br /><code>{ category, item_name }</code><br /><br /><b>Return Type:</b><br /><code>{ }</code></td>
    <td>
      <b>InputError</b> when:
      <ul>
        <li>category does not refer to a valid category</li>
        <li>item_name does not refer to a valid item_name</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>menu/item/update/order</code><br /><br /> order in which menu items are shown within a category</td>
    <td style="font-weight: bold; color: green;">GET</td>
    <td><b>Parameters:</b><br /><code>{ category, old_id, new_id }</code><br /><br /><b>Return Type:</b><br /><code>{ channels }</code></td>
    <td>N/A</td>
  </tr>
  <tr>
    <td><code>menu/item/update/details</code><br /><br />Update the description, ingredient, category, or cost of a menu item to the menu.</td>
    <td style="font-weight: bold; color: green;">PUT</td>
    <td><b>Parameters:</b><br /><code>{ category, item_name }</code><br /><br /><b>Return Type:</b><br /><code>{ }</code></td>
    <td>
      <b>InputError</b> when:
      <ul>
        <li>category does not refer to a valid category</li>
        <li>item_name does not refer to a valid item_name</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>menu/display</code><br /><br />Provide a list of all categories (and their associated menu items).</td>
    <td style="font-weight: bold; color: blue;">GET</td>
    <td><b>Parameters:</b><br /><code>{ }</code><br /><br /><b>Return Type:</b><br /><code>{ categories }</code></td>
    <td>
      N/A
    </td>
  </tr>
  <tr>
    <td><code>order/cart/add</code><br /><br />Add new menu items to their order cart</td>
    <td style="font-weight: bold; color: blue;">POST</td>
    <td><b>Parameters:</b><br /><code>{ table_id, item_name, amount }</code><br /><br /><b>Return Type:</b><br /><code>{ }</code></td>
    <td>
      <b>InputError</b> when:
      <ul>
        <li>table_id is not valid</li>
        <li>item_name is not exist</li>
        <li>amount is not valid</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>order/cart/list</code><br /><br />List the menu items that customer have added</td>
    <td style="font-weight: bold; color: blue;">GET</td>
    <td><b>Parameters:</b><br /><code>{ table_id }</code><br /><br /><b>Return Type:</b><br /><code>{ }</code></td>
    <td>
      <b>InputError</b> when:
      <ul>
        <li>table_id is not valid</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>order/history</code><br /><br />List the menu items that customer has ordered before</td>
    <td style="font-weight: bold; color: blue;">GET</td>
    <td><b>Parameters:</b><br /><code>{ customer_id }</code><br /><br /><b>Return Type:</b><br /><code>{ order }</code></td>
    <td>
      <b>InputError</b> when:
      <ul>
        <li>customer_id is not valid</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>order/listall</code><br /><br />List all current orders</td>
    <td style="font-weight: bold; color: blue;">GET</td>
    <td><b>Parameters:</b><br /><code>{ }</code><br /><br /><b>Return Type:</b><br /><code>{ time, orders }</code></td>
    <td>
      N/A
    </td>
  </tr>
  <tr>
   <tr>
    <td><code>table/add</code><br /><br />Add table details</td>
    <td style="font-weight: bold; color: blue;">POST</td>
    <td><b>Parameters:</b><br /><code>{ table_id, seat_capacity }</code><br /><br /><b>Return Type:</b><br /><code>{ }</code></td>
    <td>
     <b>InputError</b> when:
      <ul>
        <li>table_id is not valid</li>
        <li>seat_capacity is not valid</li>
      </ul>
    </td>
  </tr>
  <tr>
  <tr>
    <td><code>table/type</code><br /><br />Customer needs to select if they dine in or takeaway</td>
    <td style="font-weight: bold; color: blue;">POST</td>
    <td><b>Parameters:</b><br /><code>{ is_dine_in }</code><br /><br /><b>Return Type:</b><br /><code>{ }</code></td>
    <td>
      N/A
    </td>
  </tr>
  <tr>
   <tr>
    <td><code>table/select</code><br /><br />Select table number</td>
    <td style="font-weight: bold; color: blue;">POST</td>
    <td><b>Parameters:</b><br /><code>{ table_id }</code><br /><br /><b>Return Type:</b><br /><code>{ }</code></td>
    <td>
     <b>InputError</b> when:
      <ul>
        <li>table_id is not valid</li>
        <li>table_id is not available</li>
      </ul>
    </td>
  </tr>
  <tr>
  <tr>
   <tr>
    <td><code>table/status</code><br /><br />Check the status of tables</td>
    <td style="font-weight: bold; color: blue;">GET</td>
    <td><b>Parameters:</b><br /><code>{ }</code><br /><br /><b>Return Type:</b><br /><code>{ tables }</code></td>
    <td> </td>
  </tr>
  <tr>
  
  
  

 
</table>****