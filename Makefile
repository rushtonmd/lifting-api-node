	TESTS = test/*.js
test:
	@./node_modules/.bin/mocha -u bdd --timeout 5000 --reporter nyan $(TESTS)

.PHONY: test