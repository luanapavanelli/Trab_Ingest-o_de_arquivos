export const Header = ({ currentProject }) => {
  return (
    <header className="h-16 border-b border-neutral-800 bg-neutral-900 flex items-center px-8">
      {currentProject ? (
        <div>
          <h2 className="text-lg font-medium text-gray-200">
            {currentProject.nome}
          </h2>
          {currentProject.descricao && (
            <p className="text-xs text-gray-500 mt-0.5">{currentProject.descricao}</p>
          )}
        </div>
      ) : (
        <div className="h-6 w-48 bg-neutral-800 rounded animate-pulse"></div>
      )}
    </header>
  );
};
