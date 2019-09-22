read -p "Are you sure you want to manually deploy to staging? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  now --target staging
fi