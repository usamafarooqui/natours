npm stands for Node Package Manager. It's a library and registry for JavaScript software packages.
npm also has command-line tools to help you install the different packages and manage their dependencies. 
npm is free and relied on by over 11 million developers worldwide.



sab se pehlay npm init likhaingay terminal pe

video 16
there are 2 type of dependencies
1 simple dependencies eg slugify 
2 development dependencies nodemon

there are 2 types of installs local and global


package number gives us like 1.8.9 // 9 yani patch yani koi bug fix kia hai 8 yani minor yani new features introduce kiay hn
1 agr 2 hojaye yani huge change

to check k koi package outdated hai tou npm outdated

to install a package of a particular version npm i slugify@1.0.0


 "dependencies": { 
    "slugify": "^1.6.5"  package.json mein ^ iska mtlb minor aur patch release accept krega iske badle
     ~ ka mtlb only patch release accpet krega SO IT IS MUCH SAFER
    * accept all update release
  },

  TO UPDATE A Package npm update slugify

  to delete a package 
  npm uninstall express

  to install all packages 
   npm i 