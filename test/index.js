'use strict'

const clj = require('../');
const fs = require('fs');
const should = require('chai').should();
const gutil = require('gulp-util');
const createFile = require('../lib/createFile');

const base = './test/fixtures';
const testFilePath = `${base}/test.txt`;
const clojureFilePath = `${base}/app.clj`;
const compiledJsFixturePath =  `${base}/app.js`;
const invalidFilePath =  `${base}/invalid.clj`;


describe('gulp-clj', () => {

    it('should emit an error when passed a stream', function(done) {
      let filepath = './test/src/app.clj';
      let stream = fs.ReadStream(filepath);

      clj()
        .on('error', err => {
          err.message.should.equal('Streaming not supported');
          done();
        })
        .on('data', newFile => {
					throw new Error('No file should have been emitted!');
				})
        .write(createFile(filepath, stream));
    })

		it('should replace the .clj extension with .js',  done => {
			let contents = fs.readFileSync(clojureFilePath)
			let file = createFile(clojureFilePath, contents)

			clj()
				.on('error', err => { throw err })
				.on('data', newFile => {
					newFile.extname.should.equal('.js')
					done();
				})
				.write(file);
		})

    it('should error on invalid file content',  done => {
      let contents = fs.readFileSync(invalidFilePath)
      let file = createFile(invalidFilePath, contents)

      clj()
        .on('error', err => {
          done();
        })
        .write(file);
    })
})
