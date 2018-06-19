git pull origin dev

git add ./

git commit -m %1

git push origin dev

git checkout release

git pull origin release

git merge dev

git push origin release

git checkout dev
