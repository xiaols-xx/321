const app = require('./app');
const PORT = process.env.PORT || 8000;
const morgan = require('morgan');
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.use('/generated', express.static(path.join(__dirname, 'generate-image')));

// 添加错误处理
app.on('error', (error) => {
  console.error('Server error:', error);
});
const accessLogStream = fs.createWriteStream(path.join(__dirname,'logs', 'access.log'), { flags: 'a' });
// 添加未处理的路由处理
app.use((req, res) => {
  console.log('404 - Not Found:', req.method, req.url);
  res.status(404).json({ message: 'Route not found' });
});
app.use(morgan('combined', { stream: accessLogStream }));