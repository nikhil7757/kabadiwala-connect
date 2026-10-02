export const scrapItems = [
  { id: '1', name: 'Paper', category: 'paper', rate: 14, icon: '📄' },
  { id: '2', name: 'Cardboard', category: 'paper', rate: 12, icon: '📦' },
  { id: '3', name: 'PET Plastic', category: 'plastic', rate: 18, icon: '🥤' },
  { id: '4', name: 'HDPE Plastic', category: 'plastic', rate: 22, icon: '🧴' },
  { id: '5', name: 'Hard Plastic', category: 'plastic', rate: 15, icon: '🪣' },
  { id: '6', name: 'Copper', category: 'metal', rate: 650, icon: '🔌' },
  { id: '7', name: 'Iron/Steel', category: 'metal', rate: 32, icon: '🔩' },
  { id: '8', name: 'Aluminium', category: 'metal', rate: 140, icon: '🥫' },
  { id: '9', name: 'Brass', category: 'metal', rate: 420, icon: '🎺' },
  { id: '10', name: 'E-waste Laptop', category: 'e-waste', rate: 600, icon: '💻' },
  { id: '11', name: 'Mobile', category: 'e-waste', rate: 250, icon: '📱' },
  { id: '12', name: 'CRT Monitor', category: 'e-waste', rate: 150, icon: '🖥' },
  { id: '13', name: 'Glass Bottles', category: 'glass', rate: 5, icon: '🍾' },
  { id: '14', name: 'Mixed Glass', category: 'glass', rate: 2, icon: '🪟' },
  { id: '15', name: 'Newspaper', category: 'paper', rate: 16, icon: '📰' },
];

export const cities = ['Mumbai', 'Pune', 'Delhi', 'Bengaluru', 'Hyderabad'];

export const collectors = [
  { id: 'c1', name: 'Rajesh Kumar', phone: '9876543210', city: 'Mumbai', rating: 4.8, categories: ['paper', 'plastic', 'metal'], slots: ['9am-11am', '2pm-4pm'] },
  { id: 'c2', name: 'Amit Singh', phone: '9876543211', city: 'Pune', rating: 4.5, categories: ['e-waste', 'metal'], slots: ['11am-1pm', '4pm-6pm'] },
  { id: 'c3', name: 'Suresh Patel', phone: '9876543212', city: 'Delhi', rating: 4.9, categories: ['paper', 'plastic', 'glass'], slots: ['9am-11am', '11am-1pm'] },
  { id: 'c4', name: 'Vikram Sharma', phone: '9876543213', city: 'Bengaluru', rating: 4.2, categories: ['metal', 'e-waste'], slots: ['2pm-4pm', '4pm-6pm'] },
  { id: 'c5', name: 'Ramesh Gupta', phone: '9876543214', city: 'Hyderabad', rating: 4.6, categories: ['plastic', 'metal'], slots: ['9am-11am', '4pm-6pm'] },
  { id: 'c6', name: 'Anil Desai', phone: '9876543215', city: 'Mumbai', rating: 3.9, categories: ['paper', 'glass'], slots: ['11am-1pm', '2pm-4pm'] },
  { id: 'c7', name: 'Kiran Reddy', phone: '9876543216', city: 'Bengaluru', rating: 4.7, categories: ['e-waste', 'plastic'], slots: ['9am-11am', '11am-1pm'] },
  { id: 'c8', name: 'Manoj Tiwari', phone: '9876543217', city: 'Delhi', rating: 4.1, categories: ['metal', 'glass'], slots: ['2pm-4pm', '4pm-6pm'] },
  { id: 'c9', name: 'Deepak Chahar', phone: '9876543218', city: 'Pune', rating: 4.4, categories: ['paper', 'plastic'], slots: ['9am-11am', '4pm-6pm'] },
  { id: 'c10', name: 'Sunil Yadav', phone: '9876543219', city: 'Hyderabad', rating: 4.8, categories: ['metal', 'e-waste'], slots: ['11am-1pm', '2pm-4pm'] },
  { id: 'c11', name: 'Prakash Raj', phone: '9876543220', city: 'Mumbai', rating: 4.3, categories: ['paper', 'glass'], slots: ['9am-11am', '4pm-6pm'] },
  { id: 'c12', name: 'Naveen Kumar', phone: '9876543221', city: 'Bengaluru', rating: 4.9, categories: ['plastic', 'metal'], slots: ['11am-1pm', '2pm-4pm'] },
];

export const recyclers = [
  { id: 'r1', name: 'Green Earth Metals', city: 'Mumbai', specialization: ['metal'] },
  { id: 'r2', name: 'EcoPlast Solutions', city: 'Pune', specialization: ['plastic'] },
  { id: 'r3', name: 'Delhi Paper Mills', city: 'Delhi', specialization: ['paper'] },
  { id: 'r4', name: 'TechCycle E-waste', city: 'Bengaluru', specialization: ['e-waste'] },
  { id: 'r5', name: 'Hyd Glass Processors', city: 'Hyderabad', specialization: ['glass'] },
  { id: 'r6', name: 'AllScrap India', city: 'Mumbai', specialization: ['paper', 'plastic', 'metal'] },
];

export const pickups = Array.from({ length: 40 }).map((_, i) => ({
  id: 'p' + i,
  userId: i % 2 === 0 ? 'user1' : 'user2',
  collectorId: collectors[i % collectors.length].id,
  status: ['REQUESTED', 'ACCEPTED', 'ON_THE_WAY', 'WEIGHED', 'PAID'][i % 5],
  date: new Date(Date.now() - i * 86400000).toISOString(),
  items: ['1', '3', '5', '7', '10'].slice(0, (i % 3) + 1),
  totalEstimated: 150 + i * 10
}));