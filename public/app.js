var app = angular.module('hospitalApp', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl',
      css: 'styles/style.css'
    })
    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'RegisterCtrl',
      css: 'styles/register.css'
    })
    .when('/appointments', {
      templateUrl: 'views/appointments.html',
      controller: 'AppointmentCtrl',
      css: 'styles/appointments.css'
    })
    .when('/doctors', {
      templateUrl: 'views/doctors.html',
      controller: 'DoctorsCtrl',
      css: 'styles/doctors.css'
    })
    .when('/patients', {
      templateUrl: 'views/patients.html',
      controller: 'PatientsCtrl',
      css: 'styles/patients.css'
    });
    
});

// Include the RegisterController
app.controller('RegisterCtrl', function($scope, $http) {
  $scope.user = {};

  $scope.register = function() {
    if ($scope.user.role !== 'doctor') {
      delete $scope.user.specialization;
    }

    $http.post('/api/auth/register', $scope.user)
      .then(function(response) {
        alert(response.data.message);
        $scope.user = {}; // Reset form
      })
      .catch(function(error) {
        alert('Error: ' + error.data.message);
      });
  };
}); 