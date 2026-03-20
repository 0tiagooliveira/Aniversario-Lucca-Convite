@echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0"

set "REPO_URL=https://github.com/0tiagooliveira/Aniversario-Lucca-Convite.git"
set "DEFAULT_BRANCH=main"
set "DEFAULT_COMMIT_MSG=deploy: atualiza convite"

if "%~1"=="" (
	set "COMMIT_MSG=%DEFAULT_COMMIT_MSG%"
) else (
	set "COMMIT_MSG=%*"
)

echo ==============================================
echo  Deploy Lucca Convite - GitHub + Firebase
echo ==============================================
echo.

where npm >nul 2>nul
if errorlevel 1 (
	echo [ERRO] npm nao encontrado no PATH.
	exit /b 1
)

where git >nul 2>nul
if errorlevel 1 (
	echo [ERRO] git nao encontrado no PATH.
	exit /b 1
)

where firebase >nul 2>nul
if errorlevel 1 (
	echo [ERRO] Firebase CLI nao encontrado no PATH.
	echo Instale com: npm i -g firebase-tools
	exit /b 1
)

if not exist "package.json" (
	echo [ERRO] package.json nao encontrado.
	exit /b 1
)

if not exist "firebase.json" (
	echo [ERRO] firebase.json nao encontrado.
	exit /b 1
)

echo [1/5] Build da aplicacao...
call npm run build
if errorlevel 1 (
	echo [ERRO] Build falhou. Corrija os erros e tente novamente.
	exit /b 1
)

echo [2/5] Preparando Git...
if not exist ".git" (
	echo Repositorio Git nao encontrado. Inicializando...
	git init
	if errorlevel 1 (
		echo [ERRO] Falha ao inicializar o Git.
		exit /b 1
	)
)

for /f "delims=" %%R in ('git remote') do set "HAS_REMOTE=1"
if not defined HAS_REMOTE (
	echo Configurando remote origin: %REPO_URL%
	git remote add origin %REPO_URL%
) else (
	git remote set-url origin %REPO_URL%
)

for /f "delims=" %%B in ('git branch --show-current') do set "CURRENT_BRANCH=%%B"
if not defined CURRENT_BRANCH set "CURRENT_BRANCH=%DEFAULT_BRANCH%"

git branch -M !CURRENT_BRANCH!

echo [3/5] Commit e push no GitHub...
git add -A

git diff --cached --quiet
if errorlevel 1 (
	git commit -m "%COMMIT_MSG%"
	if errorlevel 1 (
		echo [ERRO] Falha no commit. Verifique user.name e user.email do Git.
		exit /b 1
	)
) else (
	echo Nenhuma alteracao para commit.
)

git push -u origin !CURRENT_BRANCH!
if errorlevel 1 (
	echo [ERRO] Falha no push para GitHub.
	echo Verifique autenticacao/permissao do repositorio.
	exit /b 1
)

echo [4/5] Deploy no Firebase Hosting...
firebase deploy --only hosting
if errorlevel 1 (
	echo [ERRO] Falha no deploy do Firebase.
	echo Verifique login com: firebase login
	echo Verifique projeto com: firebase use --add
	exit /b 1
)

echo [5/5] Concluido com sucesso!
echo GitHub: %REPO_URL%
echo Firebase Hosting atualizado.

exit /b 0
