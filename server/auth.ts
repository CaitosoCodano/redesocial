import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { storage } from './storage';
import { User } from '@shared/schema';

// Chave secreta para JWT - em um ambiente de produção, use variáveis de ambiente
const JWT_SECRET = 'sua_chave_secreta_jwt_muito_segura';
// Tempo de expiração do token (1 dia)
const JWT_EXPIRES_IN = '24h';

// Função para gerar hash de senha
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Função para verificar senha
export const comparePassword = async (
  password: string, 
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Função para gerar token JWT
export const generateToken = (user: User): string => {
  const payload = {
    userId: user.id,
    email: user.email,
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Extrair payload do token JWT
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Middleware para verificar autenticação
export const authenticate = async (
  req: Request & { user?: User },
  res: Response,
  next: NextFunction
) => {
  try {
    // Obter o token do cabeçalho Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }
    
    // Extrair o token
    const token = authHeader.split(' ')[1];
    
    // Verificar e decodificar o token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
    
    // Buscar o usuário pelo ID contido no token
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }
    
    // Adicionar o usuário ao objeto de requisição para uso posterior
    req.user = user;
    
    // Continuar com a requisição
    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};