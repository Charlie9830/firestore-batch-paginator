"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FirestoreBatchPaginator = function () {
    function FirestoreBatchPaginator(firestore) {
        _classCallCheck(this, FirestoreBatchPaginator);

        if (firestore === undefined || firestore === null) {
            throw "An instance of the Firestore library must be provided to the contructor";
        }

        this.firestore = firestore;
        this.currentEntryCount = 0;
        this.currentBatchIndex = 0;
        this.batches = [];
        this.batches.push(this.firestore.batch());
    }

    _createClass(FirestoreBatchPaginator, [{
        key: "create",
        value: function create(documentRef, data) {
            if (this.isBatchFull()) {
                this.createNewBatch();
            }

            this.currentEntryCount++;

            return this.batches[this.currentBatchIndex].create(documentRef, data);
        }
    }, {
        key: "delete",
        value: function _delete(documentRef, precondition) {
            if (this.isBatchFull()) {
                this.createNewBatch();
            }

            this.currentEntryCount++;

            if (precondition !== undefined) {
                return this.batches[this.currentBatchIndex].delete(documentRef, precondition);
            } else {
                return this.batches[this.currentBatchIndex].delete(documentRef);
            }
        }
    }, {
        key: "set",
        value: function set(documentRef, data, options) {
            if (this.isBatchFull()) {
                this.createNewBatch();
            }

            this.currentEntryCount++;

            return this.batches[this.currentBatchIndex].set(documentRef, data, options);
        }
    }, {
        key: "update",
        value: function update(documentRef, data, precondition) {
            if (this.isBatchFull()) {
                this.createNewBatch();
            }

            this.currentEntryCount++;

            if (precondition !== undefined) {
                return this.batches[this.currentBatchIndex].update(documentRef, data, precondition);
            } else {
                return this.batches[this.currentBatchIndex].update(documentRef, data);
            }
        }
    }, {
        key: "commit",
        value: function commit() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                var requests = [];
                _this.batches.forEach(function (batch) {
                    requests.push(batch.commit());
                });

                Promise.all(requests).then(function () {
                    resolve();
                }).catch(function (error) {
                    reject(error);
                });
            });
        }
    }, {
        key: "createNewBatch",
        value: function createNewBatch() {
            var newIndex = this.batches.push(this.firestore.batch()) - 1;
            this.currentBatchIndex = newIndex;
            this.currentEntryCount = 0;
        }
    }, {
        key: "isBatchFull",
        value: function isBatchFull() {
            return this.currentEntryCount >= 500;
        }
    }]);

    return FirestoreBatchPaginator;
}();

exports.default = FirestoreBatchPaginator;
