class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root;
  }

  buildTree(arr) {
    // sort arr
    function sortArray(arr) {
      function mergeSort(arr) {
        // check if already sorted
        if (arr.length <= 1) {
          return arr;
        }

        // split unsorted array in two
        const midPoint = Math.floor(arr.length / 2);
        const left = arr.slice(0, midPoint);
        const right = arr.slice(midPoint);

        // Recursively sort both halves and merge the sorted arrays
        return merge(mergeSort(left), mergeSort(right));
      }
      function merge(left, right) {
        let sorted = [];
        let [i, j] = [0, 0];

        // Compare elements from both arrays and merge them in sorted order
        while (i < left.length && j < right.length) {
          if (left[i] <= right[j]) {
            sorted.push(left[i]);
            i++;
          } else {
            sorted.push(right[j]);
            j++;
          }
        }

        // Add any remaining elements from `left` or `right`
        return [...sorted, ...left.slice(i), ...right.slice(j)];
      }
      return mergeSort(arr);
    }
    arr = sortArray(arr);

    // remove duplicates in arr
    function removeDuplicates(arr) {
      let set = new Set(arr);
      return [...set];
    }
    arr = removeDuplicates(arr);

    // recursive function to construct BST from arr
    function createBST(arr, start, end) {
      if (start > end) return null;

      // Find the middle element
      let mid = start + Math.floor((end - start) / 2);

      // Create root node
      let root = new Node(arr[mid]);

      // Create left subtree
      root.left = createBST(arr, start, mid - 1);

      // Create right subtree
      root.right = createBST(arr, mid + 1, end);

      return root;
    }
    return createBST(arr, 0, arr.length - 1);
  }
}
