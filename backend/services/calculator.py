def calculate_profit(data):
    total_cost = data.price + data.shipping + data.import_vat + data.fee
    profit = data.sales_price - total_cost
    margin = profit / data.sales_price * 100 if data.sales_price else 0

    return {
        "profit": profit,
        "margin_percent": margin
    }
