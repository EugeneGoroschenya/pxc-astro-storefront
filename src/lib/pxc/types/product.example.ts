const product: Product = {
	productId: '001',
	catalogId: 'DRL',
	name: 'Industrial Drill',
	sku: 'DRL-001',
	createdAt: new Date('2025-02-20T12:02:52Z'),
	price: {
		currency: 'USD',
		amount: 150,
		bulkPricing: [{ minQuantity: 10, discountPrice: 135 }],
	},
	customerPricing: [
		{ customerId: 'CUST-001', price: { currency: 'USD', amount: 140 } }, // Special price for customer
	],
	stock: {
		quantity: 50,
		status: 'in_stock',
	},
	attributes: {
		brand: 'Bosch',
		power: '1200W',
		voltage: [110, 220],
		isWaterproof: true,
	},
	suppliers: [
		{
			supplierId: 'SUP-001',
			name: 'Supplier A',
			price: { currency: 'USD', amount: 120 },
			stock: {
				quantity: 500,
				status: 'in_stock',
			},
			leadTimeDays: 7,
		},
		{
			supplierId: 'SUP-002',
			name: 'Supplier B',
			price: { currency: 'USD', amount: 125 },
			stock: { quantity: 300, status: 'in_stock' },
			leadTimeDays: 14,
		},
	],
	variants: [
		{
			productId: '001',
			catalogId: 'DRL',
			variantId: '123-red',
			sku: 'DRL-001-RED',
			name: 'Industrial Drill - Red',
			attributes: {
				color: 'Red',
				weight: 3.5,
			},
			price: { currency: 'USD', amount: 155 },
			stock: { quantity: 20, status: 'in_stock' },
			suppliers: [
				{
					supplierId: 'SUP-001',
					name: 'Supplier A',
					price: { currency: 'USD', amount: 130 },
					stock: {
						quantity: 100,
						status: 'in_stock',
					},
				},
			],
		},
	],
};
