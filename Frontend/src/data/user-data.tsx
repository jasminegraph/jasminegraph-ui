import { ISelectProp, IUserAccessData } from "@/types/user-types";

export const USER_ROLES: ISelectProp[] = [
  {
    value: 'Admin',
    label: 'Admin',
  },
  {
    value: 'Viewer',
    label: 'Viewer',
  }
];

export const userData: IUserAccessData[] = [
  {
    _id: '550e8400-e29b-41d4-a716-446655440000',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    enabled: true,
  },
  {
    _id: '550e8400-e29b-41d4-a716-446655440001',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Editor',
    enabled: false,
  },
  {
    _id: '550e8400-e29b-41d4-a716-446655440002',
    fullName: 'Alice Johnson',
    email: 'alice.j@example.com',
    role: 'Viewer',
    enabled: true,
  },
  {
    _id: '550e8400-e29b-41d4-a716-446655440003',
    fullName: 'Bob Brown',
    email: 'bob.brown@example.com',
    role: 'Admin',
    enabled: true,
  },
  {
    _id: '550e8400-e29b-41d4-a716-446655440004',
    fullName: 'Charlie Green',
    email: 'charlie.g@example.com',
    role: 'Editor',
    enabled: false,
  },
  {
    _id: '550e8400-e29b-41d4-a716-446655440005',
    fullName: 'Dave Black',
    email: 'dave.black@example.com',
    role: 'Viewer',
    enabled: true,
  },
  {
    _id: '550e8400-e29b-41d4-a716-446655440006',
    fullName: 'Eve White',
    email: 'eve.white@example.com',
    role: 'Admin',
    enabled: true,
  },
  {
    _id: '550e8400-e29b-41d4-a716-446655440007',
    fullName: 'Frank Yellow',
    email: 'frank.yellow@example.com',
    role: 'Editor',
    enabled: false,
  },
  {
    _id: '550e8400-e29b-41d4-a716-446655440008',
    fullName: 'Grace Pink',
    email: 'grace.pink@example.com',
    role: 'Viewer',
    enabled: true,
  },
  {
    _id: '550e8400-e29b-41d4-a716-446655440009',
    fullName: 'Henry Blue',
    email: 'henry.blue@example.com',
    role: 'Admin',
    enabled: true,
  }
]