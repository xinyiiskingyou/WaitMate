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
    <td> named exactly <b>ingredient</b></td>
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
    <td>Dictionary containing table_id, status </td>
  </tr>
  <tr>
    <td>(outputs only) name exactly <b>item</b></td>
    <td>Dictionary containing name, description, price, ingredient, is_vegan </td>
  </tr>
  <tr>
    <td>(outputs only) named exactly <b>category</b></td>
    <td>List of dictionaries, where each dictionary contains types { category_name, [item] } </td>
  </tr>
  <tr>
    <td>(outputs only) named exactly <b> order </b></td>
    <td>Dictionary containing name, amount, timestamp </td>
  </tr>
  <tr>
    <td>(outputs only) named exactly <b> orders </b></td>
    <td>List of dictionaries, where each dictionary contains types { table_id, [order] }</td>
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
    <td style="font-weight: bold; color: blue;">POST</td>
    <td><b>Parameters:</b><br /><code>{ name }</code><br /><br /><b>Return Type:</b><br /><code>{}</code></td>
    <td>
      <b>InputError</b> when any of:
      <ul>
        <li>name already exists</li>
        <li>length of name is not between 1 and 15 characters inclusive</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>menu/category/update/order</code><br /><br />Update the order in which categories are shown on the menu.</td>
    <td style="font-weight: bold; color: orange;">PUT</td>
    <td><b>Parameters:</b><br /><code>{ category, is_up }</code><br /><br /><b>Return Type:</b><br /><code>{}</code></td>
      <td>N/A</td>
  </tr>
  <tr>
    <td><code>menu/category/update/name</code><br /><br />Update the name of menu category.</td>
    <td style="font-weight: bold; color: orange;">PUT</td>
    <td><b>Parameters:</b><br /><code>{ old_name, new_name }</code><br /><br /><b>Return Type:</b><br /><code>{}</code></td>
    <td><b>InputError</b> when any of:
      <ul>
        <li>new_name already exists</li>
        <li>old_name not exists</li>
        <li>length of new_name is not between 1 and 15 characters inclusive</li>
      </ul></td>
  </tr>
  <tr>
    <td><code>menu/item/add</code><br /><br />Add new menu item with titles, descriptions, ingredients, category, and cost to the menu</td>
    <td style="font-weight: bold; color: blue;">POST</td>
    <td><b>Parameters:</b><br /><code>{ category, item }</code><br /><br /><b>Return Type:</b><br /><code>{}</code></td>
    <td>
      <b>InputError</b> when:
      <ul>
        <li>category not exists</li>
      </ul>
      <b>AccessError</b> when:
      <ul>
        <li>category is valid and the menu item has been added to the category</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>menu/item/remove</code><br /><br />Remove existing menu item from the menu.</td>
    <td style="font-weight: bold; color: red;">DELETE</td>
    <td><b>Parameters:</b><br /><code>{ category, item_name }</code><br /><br /><b>Return Type:</b><br /><code>{}</code></td>
    <td>
      <b>InputError</b> when:
      <ul>
        <li>category does not refer to a valid category</li>
        <li>item_name does not refer to a valid item_name</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>menu/item/update/order</code><br /><br /> Update the order in which menu items are shown within a category.</td>
    <td style="font-weight: bold; color: green;">PUS</td>
    <td><b>Parameters:</b><br /><code>{ category, item_name, is_up }</code><br /><br /><b>Return Type:</b><br /><code>{}</code></td>
    <td>N/A</td>
  </tr>
  <tr>
    <td><code>menu/item/update/details</code><br /><br />Update the description, ingredient, category, or cost of a menu item to the menu.</td>
    <td style="font-weight: bold; color: orange;">PUT</td>
    <td><b>Parameters:</b><br /><code>{ category, item }</code><br /><br /><b>Return Type:</b><br /><code>{}</code></td>
    <td>
      <b>InputError</b> when:
      <ul>
        <li>category does not refer to a valid category</li>
        <li>item does not refer to a valid item</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>menu/listall</code><br /><br />Return a list of all categories and their associated menu items.</td>
    <td style="font-weight: bold; color: green;">GET</td>
    <td><b>Parameters:</b><br /><code>{}</code><br /><br /><b>Return Type:</b><br /><code>{ category }</code></td>
    <td>N/A</td>
  </tr>
  <tr>
    <td><code>order/cart/add</code><br /><br />Add menu items to the order cart.</td>
    <td style="font-weight: bold; color: blue;">POST</td>
    <td><b>Parameters:</b><br /><code>{ table_id, item_name, amount }</code><br /><br /><b>Return Type:</b><br /><code>{}</code></td>
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
    <td><code>order/cart/list</code><br /><br />List the menu items that customer has added.</td>
    <td style="font-weight: bold; color: green;">GET</td>
    <td><b>Parameters:</b><br /><code>{ table_id }</code><br /><br /><b>Return Type:</b><br /><code>{ order }</code></td>
    <td>
      <b>InputError</b> when:
      <ul>
        <li>table_id is not valid</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>order/history</code><br /><br />List the menu items that customer has ordered before.</td>
    <td style="font-weight: bold; color: green;">GET</td>
    <td><b>Parameters:</b><br /><code>{ customer_id }</code><br /><br /><b>Return Type:</b><br /><code>{ order }</code></td>
    <td>
      <b>InputError</b> when:
      <ul>
        <li>customer_id is not valid</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>order/listall</code><br /><br />Return the list all current orders</td>
    <td style="font-weight: bold; color: green;">GET</td>
    <td><b>Parameters:</b><br /><code>{}</code><br /><br /><b>Return Type:</b><br /><code>{ orders }</code></td>
    <td>
      N/A
    </td>
  </tr>
  <tr>
   <tr>
    <td><code>table/add</code><br /><br />Add table details.</td>
    <td style="font-weight: bold; color: blue;">POST</td>
    <td><b>Parameters:</b><br /><code>{ table_id, seat_capacity }</code><br /><br /><b>Return Type:</b><br /><code>{}</code></td>
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
   <tr>
    <td><code>table/select</code><br /><br />Select table number.</td>
    <td style="font-weight: bold; color: blue;">POST</td>
    <td><b>Parameters:</b><br /><code>{ table_id }</code><br /><br /><b>Return Type:</b><br /><code>{}</code></td>
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
    <td><code>table/status</code><br /><br />Check the status of tables.</td>
    <td style="font-weight: bold; color: green;">GET</td>
    <td><b>Parameters:</b><br /><code>{}</code><br /><br /><b>Return Type:</b><br /><code>{ tables }</code></td>
    <td> N/A</td>
  </tr>
  <tr>
   <tr>
    <td><code>table/status/update</code><br /><br />Update the status of tables.</td>
    <td style="font-weight: bold; color: orange;">PUT</td>
    <td><b>Parameters:</b><br /><code>{ table_id, status }</code><br /><br /><b>Return Type:</b><br /><code>{}</code></td>
    <td>
     <b>InputError</b> when:
      <ul>
        <li>table_id is not valid</li>
        <li>status is not a valid status</li>
      </ul>
    </td>
  </tr>
  <tr>
  
 
</table>****