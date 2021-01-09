function Schedule(loc1, loc2, loc3) {
  this.loc1 = loc1;
  this.loc2 = loc2;
  this.loc3 = loc3;

  this.getLocationByNumber = (num) => {
    // If Schedule becomes map then iterate here
    if(num == 1) return this.loc1
    else if (num == 2) return this.loc2
    else if (num == 3) return this.loc3
  }
}