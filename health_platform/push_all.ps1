$repo = "https://github.com/amangupta2509/AI_Native_Health_Platform.git"

"# AI_Native_Health_Platform" | Out-File README.md

@"
venv/
__pycache__/
*.pyc
.env
"@ | Out-File .gitignore

git init
git branch -M main

git remote remove origin 2>$null
git remote add origin $repo

git add README.md
git commit -m "Add README"

git add .gitignore
git commit -m "Add gitignore"

Get-ChildItem -Recurse -File |
Where-Object {
    $_.FullName -notmatch "\\venv\\" -and
    $_.FullName -notmatch "__pycache__" -and
    $_.Name -ne ".env" -and
    $_.Name -ne "README.md" -and
    $_.Name -ne ".gitignore"
} | ForEach-Object {
    git add $_.FullName
    git commit -m "Add $($_.BaseName)"
}

git push -u origin main