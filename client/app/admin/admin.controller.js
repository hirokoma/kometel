'use strict';

angular.module('kometelApp')
  .controller('AdminCtrl', function ($scope, $http, socket, Auth, User) {
    $scope.orders = [];
    $scope.buttonOf = function(state){
      if(!state){ return 'btn-default';}
      if(state === '未発送'){ return 'btn-danger';}
      if(state === '配送中'){ return 'btn-warning';}
      if(state === '配送済'){ return 'btn-success';}
    };

    $scope.deleteOrder = function(order){
      $http.delete('/api/orders/' + order._id);
    };

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.deleteUser = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
    $http.get('/api/orders/').success(function(orders) {
      $scope.orders = orders;
      socket.syncUpdates('order', $scope.orders);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('order');
    });

  });
