import { db } from './db';
import { categories, agents, users } from '@shared/schema';

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // First, create demo vendor users
    const insertedUsers = await db.insert(users).values([
      {
        id: 'demo-vendor-1',
        email: 'vendor1@agntslab.com',
        firstName: 'Alex',
        lastName: 'Johnson',
        isVendor: true
      },
      {
        id: 'demo-vendor-2', 
        email: 'vendor2@agntslab.com',
        firstName: 'Sarah',
        lastName: 'Chen',
        isVendor: true
      },
      {
        id: 'demo-vendor-3',
        email: 'vendor3@agntslab.com', 
        firstName: 'Michael',
        lastName: 'Rodriguez',
        isVendor: true
      },
      {
        id: 'demo-vendor-4',
        email: 'vendor4@agntslab.com',
        firstName: 'Emma',
        lastName: 'Williams',
        isVendor: true
      },
      {
        id: 'demo-vendor-5',
        email: 'vendor5@agntslab.com',
        firstName: 'David',
        lastName: 'Brown',
        isVendor: true
      }
    ]).returning();

    console.log(`Inserted ${insertedUsers.length} demo vendors`);

    // Insert categories
    const insertedCategories = await db.insert(categories).values([
      {
        name: 'Productivity',
        slug: 'productivity',
        description: 'AI agents that help boost your productivity and streamline workflows'
      },
      {
        name: 'AI Assistants',
        slug: 'ai-assistants', 
        description: 'Intelligent virtual assistants for various tasks'
      },
      {
        name: 'Data Analysis',
        slug: 'data-analysis',
        description: 'Agents specialized in data processing and analysis'
      },
      {
        name: 'Customer Service',
        slug: 'customer-service',
        description: 'AI agents designed to enhance customer support'
      },
      {
        name: 'Content Creation',
        slug: 'content-creation',
        description: 'Creative AI agents for writing, design, and content generation'
      }
    ]).returning();

    console.log(`Inserted ${insertedCategories.length} categories`);

    // Insert sample agents
    const sampleAgents = await db.insert(agents).values([
      // Productivity Category
      {
        name: 'TaskMaster Pro',
        description: 'An intelligent task management agent that prioritizes your to-dos, schedules meetings, and manages deadlines. Uses advanced algorithms to optimize your daily productivity.',
        shortDescription: 'Intelligent task management and scheduling assistant',
        price: '0.00',
        isFree: true,
        categoryId: insertedCategories[0].id,
        vendorId: 'demo-vendor-1',
        model: 'GPT-4',
        runtime: 'Python',
        integration: 'API',
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        downloadCount: 1250,
        rating: '4.8',
        reviewCount: 89
      },
      {
        name: 'Email Genius',
        description: 'Transform your email communication with this AI agent. It drafts professional responses, summarizes long threads, and helps you achieve inbox zero efficiently.',
        shortDescription: 'AI-powered email management and composition tool',
        price: '19.99',
        isFree: false,
        categoryId: insertedCategories[0].id,
        vendorId: 'demo-vendor-2',
        model: 'Claude',
        runtime: 'JavaScript',
        integration: 'Plugin',
        imageUrl: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        downloadCount: 892,
        rating: '4.6',
        reviewCount: 67
      },

      // AI Assistants Category  
      {
        name: 'Sherlock Analytics',
        description: 'A detective-like AI assistant that investigates data patterns, anomalies, and insights. Perfect for business intelligence and research tasks.',
        shortDescription: 'Investigative AI for data patterns and business insights',
        price: '29.99',
        isFree: false,
        categoryId: insertedCategories[1].id,
        vendorId: 'demo-vendor-3',
        model: 'GPT-4',
        runtime: 'Python',
        integration: 'API',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        downloadCount: 2100,
        rating: '4.9',
        reviewCount: 156
      },
      {
        name: 'ChatBot Builder',
        description: 'Create conversational AI assistants without coding. This agent helps you design, train, and deploy chatbots for websites, apps, and customer service.',
        shortDescription: 'No-code chatbot creation and deployment platform',
        price: '0.00',
        isFree: true,
        categoryId: insertedCategories[1].id,
        vendorId: 'demo-vendor-4',
        model: 'Custom',
        runtime: 'Docker',
        integration: 'Standalone',
        imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        downloadCount: 3400,
        rating: '4.5',
        reviewCount: 201
      },

      // Data Analysis Category
      {
        name: 'DataViz Master',
        description: 'Automatically generate stunning visualizations from your datasets. This agent analyzes your data structure and creates the most appropriate charts and graphs.',
        shortDescription: 'Automated data visualization and chart generation',
        price: '39.99',
        isFree: false,
        categoryId: insertedCategories[2].id,
        vendorId: 'demo-vendor-1',
        model: 'Custom',
        runtime: 'Python',
        integration: 'API',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        downloadCount: 756,
        rating: '4.7',
        reviewCount: 45
      },
      {
        name: 'SQL Query Assistant',
        description: 'Convert natural language questions into optimized SQL queries. Perfect for analysts and developers who want to query databases using plain English.',
        shortDescription: 'Natural language to SQL query converter',
        price: '0.00',
        isFree: true,
        categoryId: insertedCategories[2].id,
        vendorId: 'demo-vendor-5',
        model: 'GPT-4',
        runtime: 'Cloud',
        integration: 'API',
        imageUrl: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        downloadCount: 1890,
        rating: '4.4',
        reviewCount: 112
      },

      // Customer Service Category
      {
        name: 'SupportBot Pro',
        description: 'Advanced customer service AI that handles inquiries, processes refunds, and escalates complex issues. Integrates seamlessly with popular help desk platforms.',
        shortDescription: 'Advanced AI customer service and support automation',
        price: '59.99',
        isFree: false,
        categoryId: insertedCategories[3].id,
        vendorId: 'demo-vendor-2',
        model: 'Claude',
        runtime: 'Cloud',
        integration: 'Webhook',
        imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        downloadCount: 445,
        rating: '4.8',
        reviewCount: 28
      },

      // Content Creation Category
      {
        name: 'BlogCraft AI',
        description: 'Create engaging blog posts, articles, and web content. This agent researches topics, writes drafts, and optimizes content for SEO automatically.',
        shortDescription: 'AI blog writing and content creation assistant',
        price: '24.99',
        isFree: false,
        categoryId: insertedCategories[4].id,
        vendorId: 'demo-vendor-3',
        model: 'GPT-4',
        runtime: 'JavaScript',
        integration: 'API',
        imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        downloadCount: 1670,
        rating: '4.6',
        reviewCount: 93
      },
      {
        name: 'Social Media Scheduler',
        description: 'Plan, create, and schedule social media content across multiple platforms. This free agent helps maintain consistent online presence.',
        shortDescription: 'Free social media content planning and scheduling',
        price: '0.00',
        isFree: true,
        categoryId: insertedCategories[4].id,
        vendorId: 'demo-vendor-4',
        model: 'Custom',
        runtime: 'JavaScript',
        integration: 'Plugin',
        imageUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        downloadCount: 2890,
        rating: '4.3',
        reviewCount: 178
      }
    ]).returning();

    console.log(`Inserted ${sampleAgents.length} agents`);
    console.log('Database seeding completed successfully!');

    return {
      categories: insertedCategories,
      agents: sampleAgents
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => {
    console.log('Seeding complete!');
    process.exit(0);
  }).catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
}