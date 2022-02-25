msg=$1
if [ -n "$msg" ]; then
    gss
    git add .
    git commit -m "${msg}"
    git pull
    git push
    echo "🙆‍♂️finish push"
else
    echo "🙅‍♂️ please add commit"
fi