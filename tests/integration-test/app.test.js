const app = require("../../assets/js/app");



test('test timeConverter', () => {
	expect(app.timeConverter(0)).toBe("Jan 1, 1970 at 0:0:0"); 
	expect(app.timeConverter(1)).toBe("Jan 1, 1970 at 0:0:1"); 
});

