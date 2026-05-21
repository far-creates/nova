export async function getConnection() {
  const { prisma } = await import('./client');
  return prisma;
}

export async function closeConnection() {
  const { prisma } = await import('./client');
  await prisma.$disconnect();
}
