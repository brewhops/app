read -p "Are you sure you want to manually deploy to production? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  now --target production -b VUE_APP_DEPLOYMENT=production-live
fi