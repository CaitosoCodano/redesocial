export default function RightSidebar() {
    return (
      <div className="hidden lg:block w-80 bg-white border-l border-gray-200 h-screen sticky top-0 overflow-y-auto">
        {/* Trading Tops Section */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">TRADING TOPS</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=85&h=85&q=80"
                  alt="Profile picture"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Marketing Digital</p>
                <p className="text-xs text-gray-500">
                  Trending with <span className="text-primary">#MarketingTips</span>
                </p>
              </div>
            </div>
  
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1602934585418-f588bea4215c?ixlib=rb-1.2.1&auto=format&fit=crop&w=85&h=85&q=80"
                  alt="Profile picture"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Tecnologia</p>
                <p className="text-xs text-gray-500">
                  Trending with <span className="text-primary">#Inovação</span>
                </p>
              </div>
            </div>
  
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=85&h=85&q=80"
                  alt="Profile picture"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Empreendedorismo</p>
                <p className="text-xs text-gray-500">
                  Trending with <span className="text-primary">#Business</span>
                </p>
              </div>
            </div>
  
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-1.2.1&auto=format&fit=crop&w=85&h=85&q=80"
                  alt="Profile picture"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Desenvolvimento Pessoal</p>
                <p className="text-xs text-gray-500">
                  Trending with <span className="text-primary">#Mindset</span>
                </p>
              </div>
            </div>
          </div>
        </div>
  
        <hr className="my-4 border-gray-200" />
  
        {/* Friend Suggestions */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">SUGESTÕES DE AMIZADE</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=85&h=85&q=80"
                alt="Friend profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Ricardo Fernandes</p>
                <p className="text-xs text-gray-500">12 amigos em comum</p>
                <div className="flex space-x-2 mt-2">
                  <button className="px-3 py-1 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90 transition">
                    Adicionar
                  </button>
                  <button className="px-3 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-md hover:bg-gray-300 transition">
                    Remover
                  </button>
                </div>
              </div>
            </div>
  
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=85&h=85&q=80"
                alt="Friend profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Mariana Costa</p>
                <p className="text-xs text-gray-500">8 amigos em comum</p>
                <div className="flex space-x-2 mt-2">
                  <button className="px-3 py-1 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90 transition">
                    Adicionar
                  </button>
                  <button className="px-3 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-md hover:bg-gray-300 transition">
                    Remover
                  </button>
                </div>
              </div>
            </div>
  
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=85&h=85&q=80"
                alt="Friend profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Eduardo Dias</p>
                <p className="text-xs text-gray-500">15 amigos em comum</p>
                <div className="flex space-x-2 mt-2">
                  <button className="px-3 py-1 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90 transition">
                    Adicionar
                  </button>
                  <button className="px-3 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-md hover:bg-gray-300 transition">
                    Remover
                  </button>
                </div>
              </div>
            </div>
  
            <a href="#" className="block text-sm text-primary font-medium hover:underline pt-2">
              Ver todas as sugestões
            </a>
          </div>
        </div>
  
        {/* Footer */}
        <div className="px-4 py-6 text-xs text-gray-500">
          <div className="flex flex-wrap gap-x-3 gap-y-2">
            <a href="#" className="hover:underline">
              Sobre
            </a>
            <a href="#" className="hover:underline">
              Ajuda
            </a>
            <a href="#" className="hover:underline">
              Termos de Uso
            </a>
            <a href="#" className="hover:underline">
              Privacidade
            </a>
            <a href="#" className="hover:underline">
              Configurações
            </a>
          </div>
          <p className="mt-4">© 2023 SocialNet. Todos os direitos reservados.</p>
        </div>
      </div>
    );
  }
  