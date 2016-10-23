angular.module('admin')
    .component('categories', {
        templateUrl: "admin/components/categories/categories.html",
        controller: [function() {
            var self = this;
            self.addCategory = function(){
                self.tree_data.push({
                    "DemographicId": 8,
                    "ParentId": 1,
                    "Name": "New York",
                    "Description": "The largest diverse city",
                    "Area": 141300,
                    "Population": 19651127,
                    "TimeZone": "Eastern Time Zone"
                })
            }
            self.my_tree = {};
            self.tree_data = [
                {
                    "DemographicId": 1,
                    "ParentId": null,
                    "Name": "United States of America",
                    "Description": "United States of America",
                    "Area": 9826675,
                    "Population": 318212000,
                    "TimeZone": "UTC -5 to -10",
                    "children":[{
                        "DemographicId": 2,
                        "ParentId": 1,
                        "Name": "California",
                        "Description": "The Tech State",
                        "Area": 423970,
                        "Population": 38340000,
                        "TimeZone": "Pacific Time"
                    },
                        {
                            "DemographicId": 3,
                            "ParentId": 2,
                            "Name": "San Francisco",
                            "Description": "The happening city",
                            "Area": 231,
                            "Population": 837442,
                            "TimeZone": "PST"
                        },
                        {
                            "DemographicId": 4,
                            "ParentId": 2,
                            "Name": "Los Angeles",
                            "Description": "Disco city",
                            "Area": 503,
                            "Population": 3904657,
                            "TimeZone": "PST"
                        }]
                },

                {
                    "DemographicId": 5,
                    "ParentId": 1,
                    "Name": "Illinois",
                    "Description": "Not so cool",
                    "Area": 57914,
                    "Population": 12882135,
                    "TimeZone": "Central Time Zone"
                },
                {
                    "DemographicId": 6,
                    "ParentId": 5,
                    "Name": "Chicago",
                    "Description": "Financial City",
                    "Area": 234,
                    "Population": 2695598,
                    "TimeZone": "CST"
                },
                {
                    "DemographicId": 7,
                    "ParentId": 1,
                    "Name": "Texas",
                    "Description": "Rances, Oil & Gas",
                    "Area": 268581,
                    "Population": 26448193,
                    "TimeZone": "Mountain"
                },
                {
                    "DemographicId": 8,
                    "ParentId": 1,
                    "Name": "New York",
                    "Description": "The largest diverse city",
                    "Area": 141300,
                    "Population": 19651127,
                    "TimeZone": "Eastern Time Zone"
                }

            ];
            self.expanding_property = {
                /*template: "<td>OK All</td>",*/
                field: 'Name',
                titleClass:  'text-center',
                cellClass:   'v-middle',
                displayName: 'Name'
            };
            self.col_defs = [
                {
                    field: 'Description'
                },  {
                    displayName:  'Function',
                    cellTemplate: '<button ng-if="!row.branch.parent_uid" ng-click="cellTemplateScope.add(tree_rows, row.branch)" class="btn btn-default btn-sm">Added Controller!</button>',
                    cellTemplateScope: {
                        add: function(data, row) {
                            data[_.findIndex(data, {branch: {Name: row.Name}})].branch.children.push({
                                "DemographicId": 8,
                                "ParentId": 1,
                                "Name": "New York",
                                "Description": "The largest diverse city",
                                "Area": 141300,
                                "Population": 19651127,
                                "TimeZone": "Eastern Time Zone"
                            })
                        }}
                }, {
                    displayName:  'Remove',
                    cellTemplate: '<button ng-click="cellTemplateScope.delete(tree_rows, row.branch)" class="btn btn-default btn-sm">Remove</button>',
                    cellTemplateScope: {
                        delete: function(data, row) {
                            console.log(data)
                            if(!row.parent_uid){
                                console.log('+')
                                data.splice(_.findIndex(data, {branch: {Name: row.Name}}), 1)
                            }else{
                                var parent = _.find(data, {branch: {uid: row.parent_uid}});
                                var parentId = _.findIndex(data, {branch: {uid: row.parent_uid}});
                                //console.log(parent.branch.children)
                                //console.log(data[0].branch);
                                data[parentId].branch.children.splice(_.findIndex(parent.branch.children, {Name: row.Name}), 1);
                            }

                        }}
                }];

        }]
    });
