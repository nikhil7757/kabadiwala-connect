export const scrapItems = [
  { id: '1', name: 'Paper', category: 'paper', rate: 15, icon: '📄' },
  { id: '2', name: 'Cardboard', category: 'paper', rate: 10, icon: '📦' },
  { id: '3', name: 'PET Plastic', category: 'plastic', rate: 20, icon: '🥤' },
  { id: '4', name: 'HDPE Plastic', category: 'plastic', rate: 25, icon: '🧴' },
  { id: '5', name: 'Copper', category: 'metal', rate: 600, icon: '🔌' },
  { id: '6', name: 'Iron', category: 'metal', rate: 30, icon: '🔩' },
  { id: '7', name: 'Aluminium', category: 'metal', rate: 120, icon: '🥫' },
  { id: '8', name: 'Laptop', category: 'e-waste', rate: 500, icon: '💻' },
  { id: '9', name: 'Mobile', category: 'e-waste', rate: 200, icon: '📱' },
  { id: '10', name: 'CRT Monitor', category: 'e-waste', rate: 100, icon: '🖥' },
  { id: '11', name: 'Glass Bottles', category: 'glass', rate: 5, icon: '🍾' },
  { id: '12', name: 'Mixed Glass', category: 'glass', rate: 2, icon: '🪟' },
];

export const collectors = [
  { id: 'c1', name: 'Rajesh Kumar', phone: '9876543210', city: 'Mumbai', rating: 4.8, categories: ['paper', 'plastic', 'metal'], slots: ['9am-11am', '2pm-4pm'] },
  { id: 'c2', name: 'Amit Singh', phone: '9876543211', city: 'Pune', rating: 4.5, categories: ['e-waste', 'metal'], slots: ['11am-1pm', '4pm-6pm'] },
  { id: 'c3', name: 'Suresh Patel', phone: '9876543212', city: 'Delhi', rating: 4.9, categories: ['paper', 'plastic', 'glass'], slots: ['9am-11am', '11am-1pm'] },
  { id: 'c4', name: 'Vikram Sharma', phone: '9876543213', city: 'Bangalore', rating: 4.2, categories: ['metal', 'e-waste'], slots: ['2pm-4pm', '4pm-6pm'] },
  { id: 'c5', name: 'Ramesh Gupta', phone: '9876543214', city: 'Mumbai', rating: 4.6, categories: ['plastic', 'metal'], slots: ['9am-11am', '4pm-6pm'] },
  { id: 'c6', name: 'Anil Desai', phone: '9876543215', city: 'Pune', rating: 3.9, categories: ['paper', 'glass'], slots: ['11am-1pm', '2pm-4pm'] },
  { id: 'c7', name: 'Kiran Reddy', phone: '9876543216', city: 'Bangalore', rating: 4.7, categories: ['e-waste', 'plastic'], slots: ['9am-11am', '11am-1pm'] },
  { id: 'c8', name: 'Manoj Tiwari', phone: '9876543217', city: 'Delhi', rating: 4.1, categories: ['metal', 'glass'], slots: ['2pm-4pm', '4pm-6pm'] },
];

export const pickups = Array.from({ length: 30 }).map((_, i) => ({
  id: 'p' + i,
  userId: i % 2 === 0 ? 'user1' : 'user2',
  collectorId: collectors[i % collectors.length].id,
  status: ['REQUESTED', 'ACCEPTED', 'ON_THE_WAY', 'WEIGHED', 'PAID'][i % 5],
  date: new Date(Date.now() - i * 86400000).toISOString(),
  items: ['1', '3', '5'],
  totalEstimated: 150 + i * 10
}));