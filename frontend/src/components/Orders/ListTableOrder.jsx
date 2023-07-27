const ListTableOrder = async (index) => {
  try {
    const response = await fetch(`http://localhost:8000/order/cart/list?table_id=${index}`);
    const data = await response.json();
    let order_list = []
    for (var i of data) {
      order_list.push({ name: i[0], amount: i[1], is_prepared: i[2], is_served: i[3], cost: i[4] })
    }
    return order_list;
  } catch (error) {
    console.error('Error fetching table order:', error);
  }
}

export default ListTableOrder;
