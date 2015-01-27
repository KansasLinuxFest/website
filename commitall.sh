for x in `cat repos.txt`; do echo $x; 
    pushd $x; 
    git status; 
    git commit -m 'wip' -a; 
    git clean -f; 
    git push;
    popd; done 
