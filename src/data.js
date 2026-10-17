export const initialInvitations = [
  { id: 1, ticket_code: 'GZ26-SCH-8K2P', type: 'school', school_name: 'SMK Metland Cibitung', teacher_names: ['Ibu Rina Pratiwi'], guest_name: '', parent_1_name: '', parent_2_name: '', seat_area: 'REG-A · A01', scan_count: 7, max_scans: 10, status: 'Aktif' },
  { id: 2, ticket_code: 'GZ26-VIP-4M9Q', type: 'vip', school_name: '', teacher_names: [], guest_name: 'Dr. Arya Wicaksana', parent_1_name: '', parent_2_name: '', seat_area: 'VIP · V03', scan_count: 0, max_scans: 1, status: 'Aktif' },
  { id: 3, ticket_code: 'GZ26-PAR-2J7L', type: 'parent', school_name: '', teacher_names: [], guest_name: '', parent_1_name: 'Bapak Budi Santoso', parent_2_name: 'Ibu Maya Santoso', seat_area: 'FAM · F12', scan_count: 1, max_scans: 2, status: 'Aktif' },
  { id: 4, ticket_code: 'GZ26-SCH-6T3R', type: 'school', school_name: 'SMA Negeri 1 Cibitung', teacher_names: ['Pak Dedi Saputra', 'Ibu Sari Dewi'], guest_name: '', parent_1_name: '', parent_2_name: '', seat_area: 'REG-B · B04', scan_count: 10, max_scans: 10, status: 'Kuota penuh' },
  { id: 5, ticket_code: 'GZ26-VIP-9N5X', type: 'vip', school_name: '', teacher_names: [], guest_name: 'Nadia Kusumawardani', parent_1_name: '', parent_2_name: '', seat_area: 'VIP · V01', scan_count: 1, max_scans: 1, status: 'Kuota penuh' },
  { id: 6, ticket_code: 'GZ26-PAR-5B8W', type: 'parent', school_name: '', teacher_names: [], guest_name: '', parent_1_name: 'Ibu Lestari', parent_2_name: '', seat_area: 'FAM · F07', scan_count: 0, max_scans: 1, status: 'Aktif' },
]
export const categoryLabel = { school: 'Tamu Sekolah', vip: 'VIP', parent: 'Orang Tua / Wali' }
export const getInvitee = (item) => item.type === 'school' ? item.school_name : item.type === 'vip' ? item.guest_name : [item.parent_1_name, item.parent_2_name].filter(Boolean).join(' & ')
