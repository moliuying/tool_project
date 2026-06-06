export interface LinuxCommandOption {
  name: string
  description: string
}

export interface LinuxCommandExample {
  command: string
  description: string
}

export interface LinuxCommand {
  name: string
  category: string
  description: string
  syntax: string
  options: LinuxCommandOption[]
  examples: LinuxCommandExample[]
  seeAlso?: string[]
}

export const linuxCommands: LinuxCommand[] = [
  {
    name: 'ls',
    category: '文件管理',
    description: '列出目录内容，显示文件和子目录信息。是 Linux 中最常用的命令之一，用于浏览文件系统。',
    syntax: 'ls [选项]... [文件]...',
    options: [
      { name: '-a, --all', description: '显示所有文件，包括隐藏文件（以 . 开头的文件）' },
      { name: '-l', description: '使用长格式显示，包含文件权限、所有者、大小、时间等详细信息' },
      { name: '-h, --human-readable', description: '以人类可读的格式显示文件大小（如 K、M、G）' },
      { name: '-t', description: '按修改时间排序，最新修改的在前' },
      { name: '-S', description: '按文件大小排序，最大的在前' },
      { name: '-r, --reverse', description: '反向排序' },
      { name: '-R, --recursive', description: '递归显示子目录内容' },
      { name: '-i, --inode', description: '显示每个文件的 inode 号' }
    ],
    examples: [
      { command: 'ls -la', description: '显示当前目录下所有文件（包括隐藏文件）的详细信息' },
      { command: 'ls -lh /var/log', description: '以人类可读格式显示 /var/log 目录内容' },
      { command: 'ls -lt', description: '按修改时间排序显示文件，最新的在前' },
      { command: 'ls -R /etc', description: '递归显示 /etc 及其所有子目录内容' }
    ],
    seeAlso: ['dir', 'cd', 'pwd', 'stat']
  },
  {
    name: 'cd',
    category: '文件管理',
    description: '切换当前工作目录。用于在文件系统中导航，进入或退出目录。',
    syntax: 'cd [目录]',
    options: [
      { name: '~ 或 无参数', description: '切换到当前用户的主目录（HOME 目录）' },
      { name: '-', description: '切换到上一个工作目录' },
      { name: '..', description: '切换到上一级目录（父目录）' },
      { name: '/', description: '切换到根目录' },
      { name: '.', description: '当前目录（通常不单独使用）' }
    ],
    examples: [
      { command: 'cd /etc', description: '切换到 /etc 目录' },
      { command: 'cd ~', description: '切换到当前用户主目录' },
      { command: 'cd ..', description: '返回上一级目录' },
      { command: 'cd -', description: '切换到上次所在的目录' },
      { command: 'cd /var/log/nginx', description: '切换到绝对路径 /var/log/nginx' }
    ],
    seeAlso: ['pwd', 'ls', 'mkdir']
  },
  {
    name: 'pwd',
    category: '文件管理',
    description: '显示当前工作目录的完整绝对路径。当在文件系统中导航时，帮助确认当前所在位置。',
    syntax: 'pwd [选项]...',
    options: [
      { name: '-L, --logical', description: '显示逻辑路径（包含符号链接）' },
      { name: '-P, --physical', description: '显示物理路径（解析所有符号链接后的真实路径）' }
    ],
    examples: [
      { command: 'pwd', description: '显示当前工作目录的完整路径' },
      { command: 'pwd -P', description: '显示物理路径，解析符号链接' }
    ],
    seeAlso: ['cd', 'ls', 'readlink']
  },
  {
    name: 'cat',
    category: '文件管理',
    description: '连接文件并打印到标准输出。常用于查看文件内容、合并文件、创建新文件。',
    syntax: 'cat [选项]... [文件]...',
    options: [
      { name: '-n, --number', description: '对所有输出行进行编号' },
      { name: '-b, --number-nonblank', description: '只对非空行进行编号' },
      { name: '-s, --squeeze-blank', description: '压缩连续的空行为一行' },
      { name: '-A, --show-all', description: '显示所有非打印字符' },
      { name: '-v, --show-nonprinting', description: '显示非打印字符（换行符和制表符除外）' }
    ],
    examples: [
      { command: 'cat file.txt', description: '查看 file.txt 的内容' },
      { command: 'cat -n file.txt', description: '显示文件内容并显示行号' },
      { command: 'cat file1.txt file2.txt > combined.txt', description: '合并两个文件到 combined.txt' },
      { command: 'cat > newfile.txt', description: '创建新文件并输入内容（Ctrl+D 结束）' },
      { command: 'cat file.txt | grep "pattern"', description: '将文件内容通过管道传给 grep 搜索' }
    ],
    seeAlso: ['less', 'more', 'head', 'tail', 'tac']
  },
  {
    name: 'grep',
    category: '文本处理',
    description: '在文件中搜索匹配的模式。支持正则表达式，是文本搜索和过滤的强大工具。',
    syntax: 'grep [选项]... 模式 [文件]...',
    options: [
      { name: '-i, --ignore-case', description: '忽略大小写进行匹配' },
      { name: '-v, --invert-match', description: '反向匹配，显示不包含模式的行' },
      { name: '-r, --recursive', description: '递归搜索子目录中的文件' },
      { name: '-n, --line-number', description: '显示匹配行的行号' },
      { name: '-l, --files-with-matches', description: '只显示包含匹配的文件名' },
      { name: '-c, --count', description: '只显示匹配的行数' },
      { name: '-E, --extended-regexp', description: '使用扩展正则表达式' },
      { name: '-o, --only-matching', description: '只显示匹配的部分，而非整行' },
      { name: '-A NUM, --after-context=NUM', description: '显示匹配行后 NUM 行' },
      { name: '-B NUM, --before-context=NUM', description: '显示匹配行前 NUM 行' },
      { name: '-C NUM, --context=NUM', description: '显示匹配行前后各 NUM 行' }
    ],
    examples: [
      { command: 'grep "error" /var/log/syslog', description: '在系统日志中搜索包含 error 的行' },
      { command: 'grep -rn "TODO" ./src', description: '递归搜索 src 目录中包含 TODO 的文件并显示行号' },
      { command: 'grep -i "linux" file.txt', description: '在文件中搜索 linux，忽略大小写' },
      { command: 'grep -v "^#" /etc/nginx/nginx.conf', description: '显示配置文件中所有非注释行' },
      { command: 'ps aux | grep nginx', description: '查找 nginx 相关进程' },
      { command: 'grep -E "(error|warning)" app.log', description: '使用扩展正则匹配 error 或 warning' }
    ],
    seeAlso: ['egrep', 'fgrep', 'find', 'sed', 'awk']
  },
  {
    name: 'chmod',
    category: '权限管理',
    description: '修改文件或目录的访问权限。支持符号模式和数字（八进制）模式两种方式。',
    syntax: 'chmod [选项]... 模式 文件...',
    options: [
      { name: '-R, --recursive', description: '递归修改目录及其下所有文件和子目录的权限' },
      { name: '-v, --verbose', description: '显示每个文件的处理信息' },
      { name: '-c, --changes', description: '只在文件权限发生改变时输出信息' },
      { name: '--reference=RFILE', description: '使用参考文件 RFILE 的权限而非指定模式' }
    ],
    examples: [
      { command: 'chmod 755 script.sh', description: '设置脚本所有者可读写执行，组和其他用户可读执行' },
      { command: 'chmod +x script.sh', description: '给脚本添加可执行权限' },
      { command: 'chmod 644 file.txt', description: '设置文件所有者可读写，组和其他用户只读' },
      { command: 'chmod -R 755 /var/www', description: '递归修改 /var/www 下所有文件和目录权限' },
      { command: 'chmod u+w,g+rw,o-r file.txt', description: '符号模式：所有者加写、组加读写、其他用户去读' },
      { command: 'chmod o-wx public/', description: '去除其他用户对 public 目录的写和执行权限' }
    ],
    seeAlso: ['chown', 'chgrp', 'umask', 'stat', 'ls']
  },
  {
    name: 'chown',
    category: '权限管理',
    description: '修改文件或目录的所有者和所属组。需要 root 权限才能修改文件所有者。',
    syntax: 'chown [选项]... [所有者][:[组]] 文件...',
    options: [
      { name: '-R, --recursive', description: '递归修改目录及其下所有文件' },
      { name: '-v, --verbose', description: '显示每个文件的处理信息' },
      { name: '-c, --changes', description: '只在文件所有者或组改变时输出信息' },
      { name: '--from=当前所有者:当前组', description: '只当文件的当前所有者和组匹配时才修改' }
    ],
    examples: [
      { command: 'chown user:group file.txt', description: '将文件所有者改为 user，所属组改为 group' },
      { command: 'chown user file.txt', description: '只修改文件所有者为 user' },
      { command: 'chown :group file.txt', description: '只修改文件所属组为 group' },
      { command: 'chown -R www-data:www-data /var/www/html', description: '递归修改 Web 根目录的所有者和组' },
      { command: 'chown -R nginx:nginx /var/log/nginx', description: '递归修改 nginx 日志目录的所有者' }
    ],
    seeAlso: ['chmod', 'chgrp', 'usermod', 'groupadd']
  },
  {
    name: 'ps',
    category: '进程管理',
    description: '查看当前系统中运行的进程状态。显示进程 ID、CPU 占用、内存占用、运行时间等信息。',
    syntax: 'ps [选项]',
    options: [
      { name: 'aux', description: 'BSD 风格：显示所有用户的所有进程，包含详细信息（最常用组合）' },
      { name: '-ef', description: 'System V 风格：显示所有进程的完整格式信息' },
      { name: '-e, -A', description: '显示所有进程' },
      { name: '-f', description: '显示完整格式的信息（UID, PID, PPID, C, STIME, TTY, TIME, CMD）' },
      { name: '-l', description: '显示长格式信息' },
      { name: '-u 用户', description: '显示指定用户的进程' },
      { name: '-o 自定义字段', description: '自定义输出字段，如 ps -eo pid,ppid,cmd,%mem,%cpu' },
      { name: '--sort=字段', description: '按指定字段排序，如 --sort=-%cpu 按 CPU 降序' }
    ],
    examples: [
      { command: 'ps aux', description: '显示所有用户的所有进程详细信息' },
      { command: 'ps -ef', description: '以 System V 风格显示所有进程完整信息' },
      { command: 'ps aux | grep nginx', description: '查找 nginx 相关进程' },
      { command: 'ps -u root', description: '显示 root 用户的所有进程' },
      { command: 'ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%mem | head -10', description: '按内存使用排序，显示前 10 个最耗内存的进程' },
      { command: 'ps -ef --forest', description: '以树形结构显示进程间的父子关系' }
    ],
    seeAlso: ['top', 'htop', 'kill', 'pkill', 'pgrep']
  },
  {
    name: 'top',
    category: '进程管理',
    description: '实时动态显示系统进程和资源使用情况。是监控系统运行状态最常用的交互式工具。',
    syntax: 'top [选项]',
    options: [
      { name: '-d 秒数', description: '设置刷新间隔时间（秒），默认为 3 秒' },
      { name: '-p PID', description: '只监控指定进程 ID 的进程，可指定多个' },
      { name: '-u 用户', description: '只显示指定用户的进程' },
      { name: '-n 次数', description: '刷新指定次数后退出' },
      { name: '-b', description: '以批处理模式运行，适合输出到文件或管道' },
      { name: '-c', description: '显示完整的命令行，而非只显示命令名' },
      { name: '-H', description: '显示线程信息' }
    ],
    examples: [
      { command: 'top', description: '启动 top，实时监控系统状态（按 q 退出）' },
      { command: 'top -d 1', description: '设置每秒刷新一次' },
      { command: 'top -u nginx', description: '只显示 nginx 用户的进程' },
      { command: 'top -p 1234,5678', description: '只监控进程 ID 1234 和 5678' },
      { command: 'top -b -n 5 > top_output.txt', description: '以批处理模式运行 5 次，输出到文件' },
      { command: 'top -H -p 1234', description: '显示进程 1234 的所有线程' }
    ],
    seeAlso: ['htop', 'ps', 'vmstat', 'iostat', 'free']
  },
  {
    name: 'kill',
    category: '进程管理',
    description: '向进程发送信号。默认发送 TERM(15) 信号请求进程优雅终止，也可发送其他信号如 KILL(9) 强制终止。',
    syntax: 'kill [选项]... PID...',
    options: [
      { name: '-l, --list [信号]', description: '列出所有信号名称，或将信号编号转换为信号名称' },
      { name: '-s, --signal 信号', description: '指定要发送的信号（名称或编号）' },
      { name: '-TERM (15)', description: '优雅终止，让进程有机会清理资源（默认）' },
      { name: '-KILL (9)', description: '强制杀死进程，进程无法忽略或捕捉，可能导致数据丢失' },
      { name: '-HUP (1)', description: '挂起信号，常用于让守护进程重新加载配置' },
      { name: '-INT (2)', description: '中断信号，等同于按 Ctrl+C' },
      { name: '-STOP (19)', description: '暂停进程运行' },
      { name: '-CONT (18)', description: '恢复被暂停的进程' }
    ],
    examples: [
      { command: 'kill 1234', description: '向进程 1234 发送 TERM 信号，请求优雅终止' },
      { command: 'kill -9 1234', description: '强制杀死进程 1234（不建议作为首选）' },
      { command: 'kill -HUP 1234', description: '让 nginx 等进程重新加载配置文件' },
      { command: 'kill -l', description: '列出所有可用信号' },
      { command: 'kill -STOP 1234', description: '暂停进程 1234' },
      { command: 'kill -CONT 1234', description: '恢复暂停的进程 1234' }
    ],
    seeAlso: ['pkill', 'killall', 'pgrep', 'ps', 'top']
  },
  {
    name: 'tar',
    category: '压缩打包',
    description: '将多个文件或目录打包成一个归档文件，并可选地进行压缩。是 Linux 中最常用的备份和打包工具。',
    syntax: 'tar [选项]... 归档文件 [文件/目录]...',
    options: [
      { name: '-c, --create', description: '创建新的归档文件' },
      { name: '-x, --extract, --get', description: '从归档中提取文件（解包）' },
      { name: '-t, --list', description: '列出归档文件的内容（不解包）' },
      { name: '-v, --verbose', description: '显示详细处理过程' },
      { name: '-f, --file=归档文件', description: '指定归档文件名（必须是最后一个选项）' },
      { name: '-z, --gzip', description: '通过 gzip 压缩/解压（.tar.gz / .tgz）' },
      { name: '-j, --bzip2', description: '通过 bzip2 压缩/解压（.tar.bz2）' },
      { name: '-J, --xz', description: '通过 xz 压缩/解压（.tar.xz），压缩率最高' },
      { name: '-C, --directory=DIR', description: '解压时指定目标目录' },
      { name: '-p, --preserve-permissions', description: '保留文件原权限' },
      { name: '-P, --absolute-names', description: '保留绝对路径' },
      { name: '--exclude=模式', description: '排除匹配模式的文件' }
    ],
    examples: [
      { command: 'tar -czvf archive.tar.gz /path/to/dir', description: '将目录打包并使用 gzip 压缩，显示过程' },
      { command: 'tar -xzvf archive.tar.gz', description: '解压 gzip 压缩的 tar 包到当前目录' },
      { command: 'tar -xzvf archive.tar.gz -C /tmp', description: '解压 gzip 包到指定目录 /tmp' },
      { command: 'tar -cjvf archive.tar.bz2 /path/to/dir', description: '打包并使用 bzip2 压缩' },
      { command: 'tar -cJvf archive.tar.xz /path/to/dir', description: '打包并使用 xz 压缩（压缩率最高）' },
      { command: 'tar -tvf archive.tar.gz', description: '查看归档文件内容列表但不解压' },
      { command: 'tar -czvf backup.tar.gz --exclude="*.log" /home/user', description: '打包排除所有 .log 文件' },
      { command: 'tar -czvf - /path | ssh user@remote "cat > /backup/archive.tar.gz"', description: '通过 SSH 直接将打包内容传送到远程服务器' }
    ],
    seeAlso: ['gzip', 'gunzip', 'bzip2', 'zip', 'unzip', 'dd']
  },
  {
    name: 'gzip',
    category: '压缩打包',
    description: 'GNU 压缩工具，使用 Lempel-Ziv 算法（LZ77）压缩单个文件，压缩后文件扩展名为 .gz。不支持打包多个文件，通常与 tar 配合使用。',
    syntax: 'gzip [选项]... 文件...',
    options: [
      { name: '-d, --decompress', description: '解压（等同于 gunzip）' },
      { name: '-k, --keep', description: '压缩或解压时保留原始文件' },
      { name: '-f, --force', description: '强制覆盖已存在的输出文件' },
      { name: '-v, --verbose', description: '显示压缩比例和文件名' },
      { name: '-1 ... -9', description: '压缩级别：1=最快（压缩率低），9=最慢（压缩率最高），默认 6' },
      { name: '-r, --recursive', description: '递归压缩目录下所有文件' },
      { name: '-l, --list', description: '列出压缩文件信息（压缩率、原始大小等）' },
      { name: '-c, --stdout', description: '输出到标准输出，不修改原文件' }
    ],
    examples: [
      { command: 'gzip file.txt', description: '压缩 file.txt 为 file.txt.gz（删除原文件）' },
      { command: 'gzip -k file.txt', description: '压缩并保留原文件' },
      { command: 'gzip -d file.txt.gz', description: '解压 file.txt.gz（等同于 gunzip）' },
      { command: 'gzip -9 large_file.log', description: '使用最高压缩级别压缩' },
      { command: 'gzip -rv logs/', description: '递归压缩 logs 目录下所有文件' },
      { command: 'gzip -l file.txt.gz', description: '查看压缩文件信息和压缩率' },
      { command: 'cat file.txt | gzip -c > file.txt.gz', description: '管道方式压缩并输出到指定文件' }
    ],
    seeAlso: ['gunzip', 'tar', 'bzip2', 'xz', 'zip']
  },
  {
    name: 'gunzip',
    category: '压缩打包',
    description: 'gzip 的解压命令，用于解压 .gz 格式的压缩文件。功能等同于 gzip -d。',
    syntax: 'gunzip [选项]... 文件...',
    options: [
      { name: '-k, --keep', description: '解压后保留原始 .gz 文件' },
      { name: '-f, --force', description: '强制覆盖已存在的文件' },
      { name: '-v, --verbose', description: '显示解压过程信息' },
      { name: '-l, --list', description: '列出压缩文件内容信息' },
      { name: '-c, --stdout', description: '将解压内容输出到标准输出' },
      { name: '-r, --recursive', description: '递归解压目录下所有 .gz 文件' }
    ],
    examples: [
      { command: 'gunzip file.txt.gz', description: '解压 file.txt.gz（删除压缩包）' },
      { command: 'gunzip -k file.txt.gz', description: '解压并保留原始压缩包' },
      { command: 'gunzip -c file.txt.gz | head -20', description: '解压内容输出到管道，查看前 20 行' },
      { command: 'gunzip -rv logs/', description: '递归解压 logs 目录下所有 .gz 文件' }
    ],
    seeAlso: ['gzip', 'tar', 'unzip', 'bunzip2']
  },
  {
    name: 'zip',
    category: '压缩打包',
    description: '创建和修改 ZIP 格式压缩包，支持多文件打包和目录递归。ZIP 格式跨平台兼容性好，Windows/macOS/Linux 均原生支持。',
    syntax: 'zip [选项]... 压缩包.zip 文件/目录...',
    options: [
      { name: '-r, --recurse-paths', description: '递归压缩目录及其所有子目录' },
      { name: '-e, --encrypt', description: '加密压缩包（需输入密码）' },
      { name: '-P 密码', description: '使用命令行指定密码（不安全，仅用于脚本）' },
      { name: '-d, --delete', description: '从压缩包中删除指定文件' },
      { name: '-u, --update', description: '只更新压缩包中已更改的文件' },
      { name: '-m, --move', description: '压缩后删除原文件（移动到压缩包）' },
      { name: '-x 模式', description: '排除匹配模式的文件' },
      { name: '-v, --verbose', description: '显示详细压缩过程' },
      { name: '-1 ... -9', description: '压缩级别：1=最快，9=压缩率最高，默认 6' }
    ],
    examples: [
      { command: 'zip archive.zip file1.txt file2.txt', description: '将多个文件打包为 archive.zip' },
      { command: 'zip -r project.zip project/', description: '递归压缩整个 project 目录' },
      { command: 'zip -r site.zip public/ -x "*.log"', description: '压缩 public 目录，排除所有 .log 文件' },
      { command: 'zip -e secret.zip important.txt', description: '加密压缩文件（交互输入密码）' },
      { command: 'zip -u archive.zip new_file.txt', description: '将新文件添加到已有的压缩包' },
      { command: 'zip -d archive.zip old_file.txt', description: '从压缩包中删除 old_file.txt' },
      { command: 'zip -r -9 backup.zip data/', description: '使用最高压缩级别压缩' }
    ],
    seeAlso: ['unzip', 'tar', 'gzip', '7z']
  },
  {
    name: 'unzip',
    category: '压缩打包',
    description: '解压 ZIP 格式压缩包，支持列出内容、选择性提取、密码解压等功能。ZIP 是 Windows 世界最常见的压缩格式。',
    syntax: 'unzip [选项]... 压缩包.zip [文件...]',
    options: [
      { name: '-l, --list', description: '列出压缩包内容但不解压' },
      { name: '-d 目录', description: '解压到指定目录（目录不存在会自动创建）' },
      { name: '-o, --overwrite', description: '直接覆盖已存在文件而不询问' },
      { name: '-n, --never-overwrite', description: '不覆盖已存在的文件' },
      { name: '-q, --quiet', description: '静默模式，不输出过程信息' },
      { name: '-v, --verbose', description: '显示详细信息' },
      { name: '-P 密码', description: '使用密码解压加密压缩包' },
      { name: '-j, --junk-paths', description: '不保留压缩包内的目录结构，所有文件解压到同一层' },
      { name: '-x 模式', description: '排除指定文件不提取' }
    ],
    examples: [
      { command: 'unzip archive.zip', description: '解压 archive.zip 到当前目录' },
      { command: 'unzip archive.zip -d /tmp/extract', description: '解压到指定目录 /tmp/extract' },
      { command: 'unzip -l archive.zip', description: '列出压缩包内容但不解压' },
      { command: 'unzip -o archive.zip', description: '强制覆盖同名文件' },
      { command: 'unzip archive.zip specific_file.txt', description: '只解压压缩包中的 specific_file.txt' },
      { command: 'unzip -P mysecret secret.zip', description: '使用密码解压加密压缩包' },
      { command: 'unzip -j archive.zip', description: '解压后不保留目录结构，所有文件平铺在当前目录' }
    ],
    seeAlso: ['zip', 'tar', 'gunzip', '7z']
  },
  {
    name: 'bzip2',
    category: '压缩打包',
    description: '使用 Burrows-Wheeler 变换算法的高压缩率工具，压缩率通常优于 gzip，但压缩/解压速度较慢。压缩后扩展名为 .bz2。',
    syntax: 'bzip2 [选项]... 文件...',
    options: [
      { name: '-d, --decompress', description: '解压（等同于 bunzip2）' },
      { name: '-k, --keep', description: '压缩/解压时保留原始文件' },
      { name: '-f, --force', description: '强制覆盖输出文件' },
      { name: '-v, --verbose', description: '显示压缩比例' },
      { name: '-1 ... -9', description: '压缩块大小：1=100KB（快），9=900KB（压缩率高），默认 9' },
      { name: '-c, --stdout', description: '输出到标准输出' },
      { name: '-t, --test', description: '测试压缩包完整性，不解压' }
    ],
    examples: [
      { command: 'bzip2 large_file.iso', description: '压缩 large_file.iso 为 large_file.iso.bz2' },
      { command: 'bzip2 -k large_file.iso', description: '压缩并保留原文件' },
      { command: 'bzip2 -d large_file.iso.bz2', description: '解压 .bz2 文件' },
      { command: 'bzip2 -t archive.bz2', description: '测试压缩包是否完整' },
      { command: 'bzip2 -c -9 < big.log > big.log.bz2', description: '使用最高压缩率通过管道压缩' },
      { command: 'tar -cjvf archive.tar.bz2 data/', description: '与 tar 配合使用，创建 tar.bz2 包' }
    ],
    seeAlso: ['gzip', 'tar', 'xz', 'bunzip2', 'zip']
  },
  {
    name: 'find',
    category: '文件搜索',
    description: '在目录树中搜索文件和目录，支持按名称、类型、大小、时间、权限等多种条件查找，并可对找到的文件执行操作。',
    syntax: 'find [路径...] [表达式...]',
    options: [
      { name: '-name 模式', description: '按文件名搜索（区分大小写）' },
      { name: '-iname 模式', description: '按文件名搜索（不区分大小写）' },
      { name: '-type 类型', description: '按文件类型搜索：f=文件 d=目录 l=符号链接 b=块设备 c=字符设备 s=套接字 p=FIFO' },
      { name: '-size [+/-]大小', description: '按大小搜索：+10M 大于10MB，-100k 小于100KB' },
      { name: '-mtime [+/-]天数', description: '按修改时间搜索：+7 超过7天，-1 1天以内' },
      { name: '-atime [+/-]天数', description: '按访问时间搜索' },
      { name: '-ctime [+/-]天数', description: '按状态改变时间搜索' },
      { name: '-user 用户名', description: '按文件所有者搜索' },
      { name: '-group 组名', description: '按文件所属组搜索' },
      { name: '-perm 权限', description: '按文件权限搜索，如 -perm 755' },
      { name: '-empty', description: '查找空文件或空目录' },
      { name: '-maxdepth N', description: '限制搜索最大深度为 N 层' },
      { name: '-mindepth N', description: '搜索从第 N 层深度开始' },
      { name: '-exec 命令 {} \\;', description: '对每个找到的文件执行命令，{} 代表文件路径' },
      { name: '-exec 命令 {} +', description: '尽可能少地调用命令（批量处理）' },
      { name: '-delete', description: '删除找到的文件（谨慎使用）' },
      { name: '-o', description: '逻辑或，组合多个条件' },
      { name: '-not 或 !', description: '逻辑非，取反条件' }
    ],
    examples: [
      { command: 'find /home -name "*.txt"', description: '在 /home 下搜索所有 .txt 文件（区分大小写）' },
      { command: 'find ./src -iname "*.js" -type f', description: '在 ./src 下搜索所有 .js 文件，忽略大小写' },
      { command: 'find /var/log -type f -name "*.log" -mtime +30 -delete', description: '删除 /var/log 下超过 30 天的 .log 文件' },
      { command: 'find / -size +100M -type f 2>/dev/null', description: '查找系统中大于 100MB 的文件，忽略错误输出' },
      { command: 'find /tmp -type d -empty', description: '查找 /tmp 下所有空目录' },
      { command: 'find . -maxdepth 3 -type f -name "*.md"', description: '只在当前目录下最多 3 层深度内搜索 .md 文件' },
      { command: 'find ./src -type f -name "*.py" -exec wc -l {} +', description: '统计所有 Python 文件的行数' },
      { command: 'find . -type f \\( -name "*.jpg" -o -name "*.png" \\)', description: '搜索 .jpg 或 .png 图片文件' },
      { command: 'find /home -user www-data -type f', description: '查找 www-data 用户拥有的所有文件' },
      { command: 'find . -type f -perm 777', description: '查找权限为 777 的文件（安全风险）' }
    ],
    seeAlso: ['locate', 'which', 'whereis', 'grep', 'xargs']
  },
  {
    name: 'du',
    category: '磁盘管理',
    description: '估算文件和目录占用的磁盘空间大小。用于找出占用磁盘空间最多的文件和目录。',
    syntax: 'du [选项]... [文件]...',
    options: [
      { name: '-h, --human-readable', description: '以人类可读格式显示（K, M, G）' },
      { name: '-s, --summarize', description: '只显示每个参数的总大小' },
      { name: '-d, --max-depth=N', description: '显示 N 层深度的目录大小' },
      { name: '-a, --all', description: '显示所有文件，不只是目录' },
      { name: '-c, --total', description: '在最后显示总大小' },
      { name: '-k', description: '以 KB 为单位显示' },
      { name: '-m', description: '以 MB 为单位显示' },
      { name: '--exclude=模式', description: '排除匹配模式的文件' },
      { name: '-x, --one-file-system', description: '不跨越文件系统边界' }
    ],
    examples: [
      { command: 'du -sh /var/log', description: '显示 /var/log 目录的总大小（人类可读格式）' },
      { command: 'du -h --max-depth=1 /home', description: '显示 /home 下一级子目录各自的大小' },
      { command: 'du -ah /var | sort -rh | head -20', description: '查找 /var 下最大的 20 个文件或目录' },
      { command: 'du -shc /var/* /opt/*', description: '统计多个目录各自大小并显示总计' },
      { command: 'du -h --max-depth=2 --exclude="*.log" /var/www', description: '排除 .log 文件统计 Web 目录大小' },
      { command: 'du -sh * .[!.]* | sort -rh', description: '统计当前目录所有项目（含隐藏目录）并排序' }
    ],
    seeAlso: ['df', 'ls', 'ncdu', 'find']
  },
  {
    name: 'df',
    category: '磁盘管理',
    description: '显示文件系统的磁盘空间使用情况，包括总容量、已用空间、可用空间、挂载点等信息。',
    syntax: 'df [选项]... [文件]...',
    options: [
      { name: '-h, --human-readable', description: '以人类可读格式显示（K, M, G, T）' },
      { name: '-H, --si', description: '使用 1000 为基数（而非 1024）' },
      { name: '-a, --all', description: '显示所有文件系统，包括大小为 0 的' },
      { name: '-T, --print-type', description: '显示文件系统类型' },
      { name: '-t, --type=类型', description: '只显示指定类型的文件系统' },
      { name: '-x, --exclude-type=类型', description: '排除指定类型的文件系统' },
      { name: '-i, --inodes', description: '显示 inode 使用情况而非空间使用' },
      { name: '-m', description: '以 MB 为单位显示' },
      { name: '-k', description: '以 KB 为单位显示（默认）' }
    ],
    examples: [
      { command: 'df -h', description: '以人类可读格式显示所有挂载文件系统的磁盘使用情况' },
      { command: 'df -hT', description: '显示磁盘使用情况，并显示文件系统类型' },
      { command: 'df -h / /home /var', description: '只显示指定挂载点的磁盘信息' },
      { command: 'df -hi', description: '显示 inode 使用情况（排查磁盘未写满但无法创建文件的问题）' },
      { command: 'df -ht ext4,xfs', description: '只显示 ext4 和 xfs 类型的文件系统' },
      { command: 'df -H /var/lib/docker', description: '以 1000 为基数显示 Docker 数据分区使用情况' }
    ],
    seeAlso: ['du', 'lsblk', 'fdisk', 'mount', 'fsck']
  },
  {
    name: 'ssh',
    category: '网络工具',
    description: 'Secure Shell，加密的远程登录协议。用于安全地连接到远程服务器执行命令、传输文件。',
    syntax: 'ssh [选项] [用户@]主机 [命令]',
    options: [
      { name: '-p 端口', description: '指定远程服务器 SSH 端口（默认 22）' },
      { name: '-i 密钥文件', description: '指定用于认证的私钥文件（默认 ~/.ssh/id_rsa）' },
      { name: '-l 用户', description: '指定登录用户名' },
      { name: '-v, -vv, -vvv', description: '显示详细调试信息（用于排查连接问题）' },
      { name: '-X', description: '启用 X11 图形转发（运行远程 GUI 程序）' },
      { name: '-L 本地端口:目标:远程端口', description: '本地端口转发，将本地端口转发到远程地址' },
      { name: '-R 远程端口:目标:本地端口', description: '远程端口转发，将远程端口转发到本地地址' },
      { name: '-D 本地端口', description: '动态端口转发（SOCKS5 代理）' },
      { name: '-N', description: '不执行远程命令，只做端口转发时使用' },
      { name: '-f', description: '后台运行 SSH 连接' },
      { name: '-o 选项', description: '指定额外的 SSH 配置选项，如 -o "StrictHostKeyChecking=no"' },
      { name: '-t', description: '强制分配伪终端（用于需要交互的命令）' }
    ],
    examples: [
      { command: 'ssh user@192.168.1.100', description: '使用默认端口 22 以 user 用户登录远程服务器' },
      { command: 'ssh -p 2222 user@server.example.com', description: '使用 2222 端口连接远程服务器' },
      { command: 'ssh -i ~/.ssh/my_key user@server.com', description: '使用指定私钥文件登录' },
      { command: 'ssh user@server "ls -la /var/www"', description: '登录并执行远程命令（非交互方式）' },
      { command: 'ssh -t user@server "sudo systemctl restart nginx"', description: '执行需要交互的远程命令（如 sudo）' },
      { command: 'ssh -L 8080:localhost:80 user@server', description: '将本地 8080 端口转发到远程服务器 80 端口' },
      { command: 'ssh -L 3306:10.0.0.5:3306 user@bastion', description: '通过跳板机访问内网数据库：本地 3306 -> 10.0.0.5:3306' },
      { command: 'ssh -D 1080 user@server', description: '在本地 1080 端口启动 SOCKS5 代理（可用于浏览器翻墙）' },
      { command: 'ssh -fNL 8080:localhost:80 user@server', description: '后台运行端口转发连接（不打开 Shell）' },
      { command: 'ssh -o "StrictHostKeyChecking=no" user@new-server', description: '连接时不校验主机密钥（首次连接时使用，注意安全风险）' }
    ],
    seeAlso: ['scp', 'rsync', 'sftp', 'ssh-keygen', 'ssh-copy-id']
  },
  {
    name: 'scp',
    category: '网络工具',
    description: '基于 SSH 的安全文件复制命令。用于在本地和远程主机之间，或两个远程主机之间加密传输文件。',
    syntax: 'scp [选项]... 源文件... [用户@]主机:目标路径',
    options: [
      { name: '-r', description: '递归复制整个目录' },
      { name: '-P 端口', description: '指定远程 SSH 端口（默认 22）' },
      { name: '-i 密钥文件', description: '指定用于认证的私钥文件' },
      { name: '-p', description: '保留文件的修改时间、访问时间和权限' },
      { name: '-v', description: '显示详细调试信息' },
      { name: '-C', description: '传输过程中启用压缩' },
      { name: '-l 带宽限制', description: '限制传输带宽，单位为 Kbit/s' },
      { name: '-o 选项', description: '传递 SSH 选项' }
    ],
    examples: [
      { command: 'scp local.txt user@192.168.1.100:/tmp/', description: '将本地文件上传到远程服务器 /tmp/ 目录' },
      { command: 'scp user@192.168.1.100:/var/log/app.log ./', description: '从远程服务器下载文件到当前目录' },
      { command: 'scp -r ./project user@server:/opt/', description: '递归上传整个 project 目录到远程 /opt/' },
      { command: 'scp -P 2222 -r user@server:/data/backup/ ./local-backup/', description: '使用 2222 端口递归下载远程目录' },
      { command: 'scp -i ~/.ssh/prod_key ./backup.tar.gz user@prod:/backup/', description: '使用指定私钥上传备份文件' },
      { command: 'scp -C user@server1:/data/file.iso user@server2:/data/', description: '从 server1 直接拷贝文件到 server2（本地中转）' },
      { command: 'scp -l 2048 large.iso user@server:/tmp/', description: '限速 2048 Kbit/s（约 256 KB/s）传输大文件' }
    ],
    seeAlso: ['ssh', 'rsync', 'sftp', 'cp']
  },
  {
    name: 'rsync',
    category: '网络工具',
    description: '高效的远程（和本地）文件同步工具。通过增量同步只传输差异部分，速度远快于 scp，适合备份和镜像。',
    syntax: 'rsync [选项]... 源... [目标]',
    options: [
      { name: '-v, --verbose', description: '显示详细输出' },
      { name: '-a, --archive', description: '归档模式：递归复制，保留权限、所有者、时间戳、符号链接等（最常用）' },
      { name: '-r, --recursive', description: '递归复制目录' },
      { name: '-z, --compress', description: '传输时压缩数据' },
      { name: '-h, --human-readable', description: '以人类可读格式输出数字' },
      { name: '-n, --dry-run', description: '试运行，不实际执行任何传输（用于预先检查）' },
      { name: '--delete', description: '删除目标中存在但源中不存在的文件（完全镜像，小心使用）' },
      { name: '-P', description: '等同于 --partial --progress：显示进度并支持断点续传' },
      { name: '--partial', description: '保留未传完的文件（支持断点续传）' },
      { name: '--progress', description: '显示传输进度' },
      { name: '-e "ssh 选项"', description: '指定远程 Shell 及选项，如 -e "ssh -p 2222"' },
      { name: '--exclude=模式', description: '排除匹配模式的文件或目录' },
      { name: '--include=模式', description: '包含匹配模式的文件（与 exclude 配合使用）' },
      { name: '--backup', description: '对目标已存在的文件创建备份（避免覆盖）' },
      { name: '--backup-dir=目录', description: '指定备份文件存放目录' },
      { name: '-u, --update', description: '只在源文件比目标文件新或目标不存在时才传输' }
    ],
    examples: [
      { command: 'rsync -avz ./data/ user@server:/backup/data/', description: '归档模式压缩同步本地目录到远程服务器' },
      { command: 'rsync -avzhP user@server:/data/ ./local-copy/', description: '从远程同步到本地，显示进度和断点续传' },
      { command: 'rsync -avz --delete ./src/ user@server:/var/www/', description: '完全镜像同步，删除目标中多余文件' },
      { command: 'rsync -avn ./data/ user@server:/backup/data/', description: '试运行，查看将传输哪些文件' },
      { command: 'rsync -avz -e "ssh -p 2222" ./data/ user@server:/backup/', description: '使用自定义 SSH 端口同步' },
      { command: 'rsync -avz --exclude="*.log" --exclude="node_modules" ./project/ user@server:/opt/project/', description: '同步时排除 .log 文件和 node_modules 目录' },
      { command: 'rsync -avz --backup --backup-dir=../old-backup/ ./data/ user@server:/backup/current/', description: '同步时备份被覆盖的旧文件' },
      { command: 'rsync -avz --include="*.jpg" --exclude="*" ./images/ user@server:/images/', description: '只同步 .jpg 图片文件' },
      { command: 'rsync -avzu ./docs/ user@server:/var/www/docs/', description: '只同步更新的文件（不覆盖较新的文件）' }
    ],
    seeAlso: ['scp', 'ssh', 'cp', 'tar']
  },
  {
    name: 'netstat',
    category: '网络工具',
    description: '显示网络连接、路由表、接口统计、伪装连接和组播成员。是排查网络问题的经典工具（现代系统推荐用 ss 代替）。',
    syntax: 'netstat [选项]...',
    options: [
      { name: '-a, --all', description: '显示所有监听和非监听的套接字' },
      { name: '-t, --tcp', description: '只显示 TCP 连接' },
      { name: '-u, --udp', description: '只显示 UDP 连接' },
      { name: '-n, --numeric', description: '以数字形式显示地址和端口，不做 DNS 解析' },
      { name: '-l, --listening', description: '只显示正在监听的套接字' },
      { name: '-p, --program', description: '显示每个套接字所属的进程名和 PID（需要 root 权限）' },
      { name: '-r, --route', description: '显示内核路由表' },
      { name: '-i, --interfaces', description: '显示网络接口统计信息' },
      { name: '-s, --statistics', description: '显示各协议的统计信息' },
      { name: '-e, --extend', description: '显示额外信息（如用户 ID）' },
      { name: '-c, --continuous', description: '连续刷新显示' }
    ],
    examples: [
      { command: 'netstat -tulnp', description: '显示所有正在监听的 TCP/UDP 端口，数字格式，显示进程名（排查哪程序占用端口）' },
      { command: 'netstat -an', description: '显示所有网络连接，使用数字地址' },
      { command: 'netstat -an | grep ESTABLISHED', description: '查看所有已建立的 TCP 连接' },
      { command: 'netstat -an | grep :80', description: '查看 80 端口的所有连接情况' },
      { command: 'netstat -rn', description: '显示路由表（数字格式），类似 route -n' },
      { command: 'netstat -i', description: '显示网络接口统计（查看收发包错误）' },
      { command: 'netstat -st', description: '显示 TCP 协议统计信息' },
      { command: 'netstat -ant | awk \'{print $6}\' | sort | uniq -c | sort -rn', description: '统计各种 TCP 连接状态的数量' }
    ],
    seeAlso: ['ss', 'lsof', 'tcpdump', 'ip', 'ifconfig']
  },
  {
    name: 'ss',
    category: '网络工具',
    description: '比 netstat 更快更强大的套接字统计工具，是现代 Linux 系统中 netstat 的替代品（属于 iproute2 套件）。',
    syntax: 'ss [选项]... [过滤器]',
    options: [
      { name: '-a, --all', description: '显示所有状态的套接字' },
      { name: '-t, --tcp', description: '只显示 TCP 套接字' },
      { name: '-u, --udp', description: '只显示 UDP 套接字' },
      { name: '-x, --unix', description: '只显示 Unix 域套接字' },
      { name: '-n, --numeric', description: '不解析服务名称，以数字显示端口' },
      { name: '-l, --listening', description: '只显示正在监听的套接字' },
      { name: '-p, --processes', description: '显示使用套接字的进程' },
      { name: '-s, --summary', description: '显示套接字使用汇总统计' },
      { name: '-e, --extended', description: '显示详细的套接字信息' },
      { name: '-m, --memory', description: '显示套接字内存使用情况' },
      { name: '-4, --ipv4', description: '只显示 IPv4 套接字' },
      { name: '-6, --ipv6', description: '只显示 IPv6 套接字' },
      { name: '-r, --resolve', description: '解析主机名（默认不解析以提速）' },
      { name: '-o, --options', description: '显示定时器信息' },
      { name: 'state 状态', description: '按连接状态过滤，如 state ESTABLISHED, state LISTEN, state TIME-WAIT' },
      { name: 'dport/sport :端口', description: '按目标/源端口过滤' }
    ],
    examples: [
      { command: 'ss -tulnp', description: '显示所有正在监听的 TCP/UDP 端口及对应进程（netstat -tulnp 的现代替代）' },
      { command: 'ss -tn state established', description: '显示所有已建立的 TCP 连接（数字格式）' },
      { command: 'ss -s', description: '显示套接字使用总览（快速了解系统网络概况）' },
      { command: 'ss -tn dst 192.168.1.100', description: '显示所有目标地址为 192.168.1.100 的 TCP 连接' },
      { command: 'ss -tn sport = :80 or sport = :443', description: '显示源端口为 80 或 443 的 TCP 连接' },
      { command: 'ss -tn state established dst :443 | wc -l', description: '统计连接到 443 端口的已建立连接数' },
      { command: 'ss -tn state time-wait | wc -l', description: '统计 TIME-WAIT 状态的 TCP 连接数' },
      { command: 'ss -lntp | grep -E ":(80|443|3306|6379)\\b"', description: '检查常见服务端口是否正常监听' }
    ],
    seeAlso: ['netstat', 'lsof', 'ip', 'tcpdump']
  },
  {
    name: 'tail',
    category: '文本处理',
    description: '输出文件的末尾部分。最常用功能是实时查看日志文件的新增内容（-f 选项）。',
    syntax: 'tail [选项]... [文件]...',
    options: [
      { name: '-n, --lines=N', description: '显示最后 N 行（默认 10 行）' },
      { name: '-c, --bytes=N', description: '显示最后 N 字节' },
      { name: '-f, --follow[=name|descriptor]', description: '跟随文件增长，实时显示新内容' },
      { name: '-F', description: '等同于 --follow=name --retry，文件被轮换（logrotate）后仍能继续跟踪' },
      { name: '--retry', description: '不断尝试打开无法访问的文件' },
      { name: '-q, --quiet, --silent', description: '处理多个文件时不显示文件名标题' },
      { name: '-v, --verbose', description: '总是显示文件名标题' },
      { name: '-s, --sleep-interval=N', description: '使用 -f 时，检查文件变化的间隔秒数（默认 1.0 秒）' }
    ],
    examples: [
      { command: 'tail /var/log/syslog', description: '显示系统日志最后 10 行' },
      { command: 'tail -n 100 /var/log/nginx/access.log', description: '显示 nginx 访问日志最后 100 行' },
      { command: 'tail -f /var/log/nginx/error.log', description: '实时监控 nginx 错误日志（Ctrl+C 退出）' },
      { command: 'tail -F /var/log/app.log', description: '实时跟随日志，文件被 logrotate 轮换后仍继续跟踪' },
      { command: 'tail -f -n 0 /var/log/syslog', description: '只显示从现在开始新增的日志内容（不显示历史）' },
      { command: 'tail -c 1K large.log', description: '显示大文件最后 1KB 内容' },
      { command: 'tail -n +100 file.txt', description: '从第 100 行开始显示到文件末尾' },
      { command: 'tail -qf /var/log/nginx/*.log', description: '同时实时监控多个 nginx 日志文件，不显示文件名' }
    ],
    seeAlso: ['head', 'less', 'cat', 'grep', 'multitail']
  },
  {
    name: 'sed',
    category: '文本处理',
    description: '流编辑器（Stream Editor），对文本进行流式处理和转换。支持正则表达式替换、删除、插入、追加等操作，是 Shell 脚本中常用的文本处理工具。',
    syntax: 'sed [选项]... {脚本} [输入文件]...',
    options: [
      { name: '-n, --quiet, --silent', description: '安静模式，不自动打印模式空间内容' },
      { name: '-e 脚本, --expression=脚本', description: '将指定脚本添加到执行的命令列表' },
      { name: '-f 脚本文件, --file=脚本文件', description: '从文件中读取 sed 脚本' },
      { name: '-i[SUFFIX], --in-place[=SUFFIX]', description: '直接编辑文件，若指定 SUFFIX 则先备份' },
      { name: '-r, --regexp-extended', description: '使用扩展正则表达式' },
      { name: '-s, --separate', description: '对每个文件分别处理（而非视为连续流）' }
    ],
    examples: [
      { command: 'sed \'s/old_string/new_string/g\' file.txt', description: '将文件中所有 old_string 替换为 new_string（输出到终端，不改文件）' },
      { command: 'sed -i \'s/foo/bar/g\' config.txt', description: '直接修改文件，将所有 foo 替换为 bar' },
      { command: 'sed -i.bak \'s/foo/bar/g\' config.txt', description: '修改文件前先创建 config.txt.bak 备份' },
      { command: 'sed -i \'s/#//g\' file.conf', description: '移除文件中所有 # 字符（常用于去注释）' },
      { command: 'sed -n \'10,20p\' file.txt', description: '只显示文件的第 10 到 20 行' },
      { command: 'sed \'1,5d\' file.txt', description: '删除文件的前 5 行' },
      { command: 'sed \'/^$/d\' file.txt', description: '删除所有空行' },
      { command: 'sed \'/^#/d; /^$/d\' /etc/nginx/nginx.conf', description: '删除 nginx 配置中的注释行和空行，方便查看有效配置' },
      { command: 'sed -i \'2a insert_this_line\' file.txt', description: '在第 2 行之后插入一行内容' },
      { command: 'sed -n \'/error/p\' app.log | tail -20', description: '只打印匹配 error 的行（类似 grep），显示最后 20 条' },
      { command: 'echo "Hello World" | sed \'s/World/Linux/\'', description: '使用管道进行实时文本替换' }
    ],
    seeAlso: ['awk', 'grep', 'cut', 'tr', 'perl']
  },
  {
    name: 'awk',
    category: '文本处理',
    description: '强大的文本处理编程语言。擅长按字段处理结构化文本（如日志、CSV、TSV），支持条件判断、循环、计算等，是数据提取和报表生成的利器。',
    syntax: 'awk [选项]... \'程序\' [输入文件]...',
    options: [
      { name: '-F 分隔符, --field-separator=分隔符', description: '指定字段分隔符（默认空格或 Tab）' },
      { name: '-v var=值, --assign=var=值', description: '在执行程序前定义变量' },
      { name: '-f 脚本文件, --file=脚本文件', description: '从文件中读取 awk 脚本' },
      { name: '\'BEGIN{初始化} {每行处理} END{收尾}\'', description: 'awk 程序经典三段结构' }
    ],
    examples: [
      { command: 'awk \'{print $1}\' access.log', description: '打印日志每行的第一个字段（如客户端 IP）' },
      { command: 'awk -F \':\' \'{print $1, $6}\' /etc/passwd', description: '以冒号为分隔符，打印 /etc/passwd 中用户名（第1列）和主目录（第6列）' },
      { command: 'df -h | awk \'NR>1 {print $1, $5}\'', description: '从 df 输出中提取文件系统名和使用率，跳过表头（NR>1）' },
      { command: 'awk \'$9 == 200 {count++} END {print "200 OK 数量:", count}\' access.log', description: '统计 nginx 日志中状态码为 200 的请求数' },
      { command: 'awk \'{sum += $10} END {print "总响应字节数:", sum, "平均:", sum/NR}\' access.log', description: '计算日志中响应字节的总和和平均值' },
      { command: 'awk -F\'"\' \'{print $2}\' access.log | sort | uniq -c | sort -rn | head -10', description: '统计访问日志中最频繁的 10 个 URL' },
      { command: 'awk \'$9 ~ /^5/ {print}\' access.log', description: '筛选出所有 5xx 服务器错误日志行' },
      { command: 'ps aux | awk \'NR==1 || $3>10.0\'', description: '显示所有 CPU 使用率超过 10% 的进程，保留表头' },
      { command: 'awk -F: \'$3>=1000 {print $1, $3}\' /etc/passwd', description: '列出所有普通用户（UID >= 1000）的用户名和 UID' },
      { command: 'free -h | awk \'/Mem:/ {print "已用内存:", $3, " / 总内存:", $2}\'', description: '从 free 输出中提取内存使用信息' }
    ],
    seeAlso: ['sed', 'grep', 'cut', 'sort', 'uniq']
  },
  {
    name: 'wc',
    category: '文本处理',
    description: '统计文件中的行数、单词数和字符数。是快速文本分析的常用工具。',
    syntax: 'wc [选项]... [文件]...',
    options: [
      { name: '-l, --lines', description: '只统计行数' },
      { name: '-w, --words', description: '只统计单词数' },
      { name: '-c, --bytes', description: '只统计字节数' },
      { name: '-m, --chars', description: '只统计字符数（多字节字符按一个字符计）' },
      { name: '-L, --max-line-length', description: '显示最长行的长度' },
      { name: '无选项', description: '依次输出 行数 单词数 字节数' }
    ],
    examples: [
      { command: 'wc file.txt', description: '统计文件的行数、单词数、字节数' },
      { command: 'wc -l /var/log/nginx/access.log', description: '统计 nginx 访问日志的行数（即请求总数）' },
      { command: 'wc -l *.py', description: '统计当前目录下所有 Python 文件的行数' },
      { command: 'find ./src -name "*.js" | xargs wc -l', description: '统计 src 目录下所有 JavaScript 文件的总行数' },
      { command: 'cat file.txt | wc -m', description: '统计文件字符数（支持多字节字符）' },
      { command: 'grep "error" app.log | wc -l', description: '统计日志中包含 error 的行数' },
      { command: 'ls /etc | wc -l', description: '统计 /etc 目录下的文件和子目录数量' }
    ],
    seeAlso: ['cat', 'grep', 'awk', 'sort', 'uniq']
  },
  {
    name: 'curl',
    category: '网络工具',
    description: '命令行 URL 传输工具，支持 HTTP、HTTPS、FTP、SFTP 等多种协议。用于 API 调用、文件下载、网页抓取、接口调试。',
    syntax: 'curl [选项]... [URL]...',
    options: [
      { name: '-X, --request 方法', description: '指定 HTTP 请求方法：GET、POST、PUT、DELETE、PATCH 等' },
      { name: '-H, --header "头部"', description: '添加 HTTP 请求头部，可多次使用' },
      { name: '-d, --data 数据', description: '发送 POST 请求体数据（默认 Content-Type: application/x-www-form-urlencoded）' },
      { name: '--data-raw 数据', description: '同 -d，但不处理 @ 特殊字符' },
      { name: '--data-binary 数据', description: '发送二进制数据，不做任何处理' },
      { name: '-F, --form name=content', description: '以 multipart/form-data 方式提交表单，支持上传文件' },
      { name: '-i, --include', description: '输出中包含 HTTP 响应头' },
      { name: '-I, --head', description: '只获取响应头（发送 HEAD 请求）' },
      { name: '-v, --verbose', description: '显示详细通信过程（调试必备）' },
      { name: '-s, --silent', description: '静默模式，不显示进度和错误' },
      { name: '-S, --show-error', description: '静默模式下也显示错误信息' },
      { name: '-o, --output 文件', description: '将响应保存到指定文件' },
      { name: '-O, --remote-name', description: '使用 URL 中的文件名保存到本地' },
      { name: '-L, --location', description: '自动跟随 HTTP 重定向（3xx 响应）' },
      { name: '-u, --user 用户:密码', description: '提供 HTTP Basic 认证用户名和密码' },
      { name: '-A, --user-agent UA字符串', description: '设置 User-Agent 头部' },
      { name: '-b, --cookie 数据', description: '发送 Cookie，格式 "name1=val1;name2=val2" 或文件名' },
      { name: '-c, --cookie-jar 文件', description: '将服务器设置的 Cookie 保存到文件' },
      { name: '-x, --proxy 代理地址', description: '使用 HTTP/SOCKS 代理' },
      { name: '-k, --insecure', description: '忽略 HTTPS SSL 证书验证错误' },
      { name: '--connect-timeout 秒', description: '连接超时时间（秒）' },
      { name: '-m, --max-time 秒', description: '整个请求的最大允许时间（秒）' },
      { name: '-w, --write-out 格式', description: '请求完成后输出指定信息（如状态码、耗时等）' }
    ],
    examples: [
      { command: 'curl https://api.example.com/users', description: '发送 GET 请求并显示响应内容' },
      { command: 'curl -sSL https://example.com', description: '静默下载并跟随重定向' },
      { command: 'curl -i https://api.example.com/health', description: '获取响应头和响应体（检查接口状态）' },
      { command: 'curl -I https://example.com', description: '只获取响应头（检查 HTTP 状态和资源大小）' },
      { command: 'curl -X POST -H "Content-Type: application/json" -d \'{"name":"test","age":25}\' https://api.example.com/users', description: '发送 JSON 格式的 POST 请求' },
      { command: 'curl -X PUT -H "Authorization: Bearer token123" -d "status=active" https://api.example.com/user/1', description: '带认证 Token 的 PUT 请求' },
      { command: 'curl -F "file=@./avatar.jpg" -F "name=John" https://api.example.com/upload', description: '以表单方式上传文件和数据' },
      { command: 'curl -u admin:password https://api.example.com/admin/users', description: '使用 HTTP Basic 认证' },
      { command: 'curl -o output.html https://example.com', description: '下载网页保存为 output.html' },
      { command: 'curl -O https://example.com/file.zip', description: '下载文件并保留原文件名' },
      { command: 'curl -sS -w "\\nHTTP状态码:%{http_code} 总耗时:%{time_total}s\\n" https://api.example.com', description: '请求结束后输出状态码和耗时' },
      { command: 'curl -v -X POST -d @request.json https://api.example.com/data 2>&1 | tee debug.log', description: '调试模式：将请求详情输出到控制台并保存到日志' },
      { command: 'curl -x socks5://127.0.0.1:1080 https://example.com', description: '通过 SOCKS5 代理请求' },
      { command: 'curl -k https://self-signed.badssl.com/', description: '访问使用自签名证书的 HTTPS 网站（忽略证书校验）' },
      { command: 'curl --connect-timeout 5 -m 10 https://slow-site.example.com', description: '连接超时 5 秒，总超时 10 秒' }
    ],
    seeAlso: ['wget', 'httpie', 'nc', 'telnet']
  },
  {
    name: 'wget',
    category: '网络工具',
    description: '非交互式网络下载工具，支持 HTTP、HTTPS 和 FTP 协议。支持断点续传、递归下载整站、后台下载。',
    syntax: 'wget [选项]... [URL]...',
    options: [
      { name: '-O, --output-document=文件', description: '将下载内容保存为指定文件名' },
      { name: '-P, --directory-prefix=目录', description: '指定文件保存的目录' },
      { name: '-c, --continue', description: '断点续传，继续下载未完成的文件' },
      { name: '-b, --background', description: '启动后转到后台运行（大文件下载时退出终端也继续）' },
      { name: '-q, --quiet', description: '静默模式，不输出下载信息' },
      { name: '-v, --verbose', description: '详细输出模式' },
      { name: '-i, --input-file=文件', description: '从文件中读取 URL 列表进行批量下载' },
      { name: '-r, --recursive', description: '递归下载，可用于镜像整个网站' },
      { name: '-l, --level=N', description: '递归下载的最大深度（默认 5）' },
      { name: '--limit-rate=速率', description: '限制下载速度，如 200K、2M' },
      { name: '-N, --timestamping', description: '只在远程文件比本地新时才下载' },
      { name: '--spider', description: '只检查文件是否存在，不下载' },
      { name: '-T, --timeout=秒', description: '设置超时时间' },
      { name: '-t, --tries=N', description: '设置重试次数（0 表示无限重试）' },
      { name: '--user=用户名', description: 'HTTP/FTP 认证用户名' },
      { name: '--password=密码', description: 'HTTP/FTP 认证密码' },
      { name: '--no-check-certificate', description: '不验证 HTTPS 证书' },
      { name: '-p, --page-requisites', description: '下载网页显示所需的所有资源（图片、CSS 等）' },
      { name: '-k, --convert-links', description: '转换下载后的链接为本地相对路径' },
      { name: '-e robots=off', description: '忽略 robots.txt 限制（整站下载时可能需要）' },
      { name: '-U, --user-agent=UA字符串', description: '设置 User-Agent' },
      { name: '--proxy=地址', description: '设置 HTTP/HTTPS 代理' }
    ],
    examples: [
      { command: 'wget https://example.com/file.zip', description: '下载文件，保存到当前目录' },
      { command: 'wget -O latest.zip https://example.com/download?id=123', description: '下载并保存为指定文件名' },
      { command: 'wget -c https://example.com/large-file.iso', description: '断点续传下载大文件' },
      { command: 'wget -b https://example.com/huge-backup.tar.gz', description: '后台下载，日志输出到 wget-log' },
      { command: 'wget -i urls.txt', description: '从 urls.txt 文件读取 URL 列表批量下载' },
      { command: 'wget --limit-rate=500K https://example.com/big-file.zip', description: '限速 500 KB/s 下载，不占满带宽' },
      { command: 'wget -r -np -k -p https://example.com/docs/', description: '下载整个 docs 目录（不爬上层），转换链接，下载所需资源' },
      { command: 'wget --mirror -p --convert-links -P ./mirror https://example.com', description: '镜像整个网站到本地 mirror 目录' },
      { command: 'wget --spider -i urls.txt', description: '批量检查 URL 列表中的链接是否有效' },
      { command: 'wget --tries=10 --timeout=30 https://unstable-site.com/file', description: '重试 10 次，每次超时 30 秒' },
      { command: 'wget --user=admin --password=secret https://private.example.com/file.tar.gz', description: '带用户名密码认证下载' },
      { command: 'wget --no-check-certificate https://self-signed.example.com/file.pem', description: '不校验 SSL 证书下载' }
    ],
    seeAlso: ['curl', 'aria2c', 'rsync', 'scp']
  },
  {
    name: 'systemctl',
    category: '系统管理',
    description: 'systemd 的主管理命令，用于控制系统服务、查看服务状态、管理开机启动项、查看系统日志等。现代 Linux 发行版（CentOS 7+, Ubuntu 16.04+）的标准服务管理工具。',
    syntax: 'systemctl [选项]... 命令 [服务名...]',
    options: [
      { name: 'start 服务名', description: '启动服务' },
      { name: 'stop 服务名', description: '停止服务' },
      { name: 'restart 服务名', description: '重启服务（停止后再启动）' },
      { name: 'reload 服务名', description: '让服务重新加载配置文件（不中断服务）' },
      { name: 'status 服务名', description: '查看服务的详细状态和最近日志' },
      { name: 'enable 服务名', description: '设置服务开机自启' },
      { name: 'disable 服务名', description: '取消服务开机自启' },
      { name: 'is-enabled 服务名', description: '检查服务是否已设置开机自启' },
      { name: 'is-active 服务名', description: '检查服务是否正在运行' },
      { name: 'list-units', description: '列出所有已加载的 systemd 单元' },
      { name: 'list-unit-files', description: '列出所有已安装的单元文件及其启用状态' },
      { name: 'list-units --type=service', description: '只列出服务类型的单元' },
      { name: 'list-units --state=failed', description: '列出所有失败的单元' },
      { name: 'daemon-reload', description: '重新加载 systemd 配置（修改服务文件后需执行）' },
      { name: 'mask 服务名', description: '屏蔽服务，使其无法被手动或自动启动' },
      { name: 'unmask 服务名', description: '取消服务屏蔽' },
      { name: 'isolate target名', description: '切换到指定的运行目标（如 multi-user.target, graphical.target）' },
      { name: 'poweroff', description: '关机（等同于 systemctl poweroff）' },
      { name: 'reboot', description: '重启系统（等同于 systemctl reboot）' }
    ],
    examples: [
      { command: 'systemctl status nginx', description: '查看 nginx 服务的详细状态和最近日志' },
      { command: 'systemctl start nginx', description: '启动 nginx 服务' },
      { command: 'systemctl stop nginx', description: '停止 nginx 服务' },
      { command: 'systemctl restart nginx', description: '重启 nginx 服务' },
      { command: 'systemctl reload nginx', description: '让 nginx 重新加载配置（不中断已有连接）' },
      { command: 'systemctl enable nginx', description: '设置 nginx 开机自启' },
      { command: 'systemctl disable nginx', description: '取消 nginx 开机自启' },
      { command: 'systemctl enable --now nginx', description: '设置开机自启并立即启动服务' },
      { command: 'systemctl daemon-reload', description: '修改 .service 文件后重新加载 systemd 配置' },
      { command: 'systemctl list-units --type=service --state=running', description: '列出所有正在运行的服务' },
      { command: 'systemctl list-unit-files --type=service | grep enabled', description: '列出所有已设置开机自启的服务' },
      { command: 'systemctl mask firewalld', description: '屏蔽 firewalld 服务（防止任何方式启动）' },
      { command: 'journalctl -u nginx.service -f', description: '查看 nginx 服务的日志并实时跟随（journalctl 配合 systemctl）' }
    ],
    seeAlso: ['journalctl', 'service', 'chkconfig', 'init']
  },
  {
    name: 'journalctl',
    category: '系统管理',
    description: '查询 systemd journal 日志。是 systemd 系统中查看系统日志和服务日志的统一工具，支持按服务、时间、优先级、PID 等多维度过滤。',
    syntax: 'journalctl [选项]... [匹配项]...',
    options: [
      { name: '-u, --unit 单元名', description: '只显示指定 systemd 单元（服务）的日志' },
      { name: '-f, --follow', description: '实时跟随显示新增的日志（类似 tail -f）' },
      { name: '-n, --lines=N', description: '显示最近的 N 行日志（默认 10 行，不指定 -n 时显示所有）' },
      { name: '-e, --pager-end', description: '直接跳转到日志末尾' },
      { name: '-r, --reverse', description: '反向输出，最新的日志在最前面' },
      { name: '-k, --dmesg', description: '只显示内核日志（等同于 dmesg）' },
      { name: '-b, --boot[=ID]', description: '只显示本次或指定启动引导的日志，-b -1 表示上一次启动' },
      { name: '--since=时间', description: '只显示指定时间之后的日志，如 "2024-01-01 10:00:00" 或 "1 hour ago"' },
      { name: '--until=时间', description: '只显示指定时间之前的日志' },
      { name: '-p, --priority=级别', description: '按日志级别过滤：emerg(0), alert(1), crit(2), err(3), warning(4), notice(5), info(6), debug(7)' },
      { name: '--no-pager', description: '不使用分页器，直接输出所有内容（方便管道或重定向）' },
      { name: '-o, --output=格式', description: '输出格式：short, short-iso, verbose, json, json-pretty, cat 等' },
      { name: '--disk-usage', description: '显示 journal 日志占用的磁盘空间' },
      { name: '--vacuum-size=大小', description: '清理日志直到占用空间小于指定大小，如 --vacuum-size=500M' },
      { name: '--vacuum-time=时间', description: '删除指定时间之前的日志，如 --vacuum-time=1weeks' },
      { name: '_PID=进程号', description: '只显示指定进程的日志（字段匹配）' },
      { name: 'SYSLOG_IDENTIFIER=标识符', description: '按日志标识符过滤' }
    ],
    examples: [
      { command: 'journalctl', description: '查看所有系统日志（分页显示）' },
      { command: 'journalctl -u nginx.service', description: '查看 nginx 服务的所有日志' },
      { command: 'journalctl -u nginx.service -f', description: '实时监控 nginx 服务的日志（Ctrl+C 退出）' },
      { command: 'journalctl -u nginx.service -n 100', description: '查看 nginx 最近 100 条日志' },
      { command: 'journalctl -b -u nginx.service', description: '查看本次系统启动以来 nginx 的日志' },
      { command: 'journalctl -b -1 -u nginx.service', description: '查看上一次系统启动时 nginx 的日志（排查崩溃问题）' },
      { command: 'journalctl --since "1 hour ago" -u nginx.service', description: '查看最近 1 小时 nginx 的日志' },
      { command: 'journalctl --since "2024-01-01 00:00:00" --until "2024-01-01 12:00:00"', description: '查看指定时间段内的系统日志' },
      { command: 'journalctl -p err -b', description: '查看本次启动以来所有错误级别及以上的日志' },
      { command: 'journalctl -k', description: '查看内核日志（等同于 dmesg）' },
      { command: 'journalctl --no-pager -u nginx | grep -i error | tail -50', description: '不使用分页输出，管道给 grep 搜索 nginx 的错误日志' },
      { command: 'journalctl --disk-usage', description: '查看 journal 日志占用的磁盘空间' },
      { command: 'journalctl --vacuum-time=2weeks', description: '清理两周前的旧日志，释放磁盘空间' },
      { command: 'journalctl -o verbose -u nginx -n 1', description: '以详细格式显示 nginx 的最新一条日志（包含所有元数据字段）' }
    ],
    seeAlso: ['systemctl', 'dmesg', 'tail', 'grep', 'syslog']
  },
  {
    name: 'mkdir',
    category: '文件管理',
    description: '创建新目录。支持同时创建多级目录和设置权限。',
    syntax: 'mkdir [选项]... 目录...',
    options: [
      { name: '-p, --parents', description: '递归创建父目录，目录已存在时不报错（最常用选项）' },
      { name: '-m, --mode=权限', description: '设置新建目录的权限（类似 chmod，如 755）' },
      { name: '-v, --verbose', description: '显示每个创建目录的信息' },
      { name: '-Z', description: '设置 SELinux 安全上下文' }
    ],
    examples: [
      { command: 'mkdir project', description: '在当前目录创建 project 目录' },
      { command: 'mkdir -p a/b/c/d', description: '递归创建多级目录 a/b/c/d，父目录不存在时自动创建' },
      { command: 'mkdir -m 755 scripts', description: '创建 scripts 目录并设置权限为 755' },
      { command: 'mkdir -pv /opt/app/{config,logs,data}', description: '使用大括号扩展同时创建多个子目录并显示详情' },
      { command: 'mkdir dir1 dir2 dir3', description: '同时创建多个平级目录' }
    ],
    seeAlso: ['rmdir', 'rm', 'cd', 'ls', 'chmod']
  },
  {
    name: 'cp',
    category: '文件管理',
    description: '复制文件或目录。支持保留权限、递归复制、符号链接处理等多种功能。',
    syntax: 'cp [选项]... 源... 目标',
    options: [
      { name: '-r, -R, --recursive', description: '递归复制目录及其所有内容（复制目录时必须用）' },
      { name: '-p', description: '保留源文件的权限、所有者和时间戳' },
      { name: '-a, --archive', description: '归档模式：等同于 -dr --preserve=all，完整保留所有属性（备份常用）' },
      { name: '-v, --verbose', description: '显示每个复制操作的详细信息' },
      { name: '-i, --interactive', description: '覆盖目标文件前询问确认' },
      { name: '-f, --force', description: '强制覆盖，不提示（危险）' },
      { name: '-n, --no-clobber', description: '不覆盖已存在的目标文件' },
      { name: '-u, --update', description: '只在源文件比目标文件新或目标不存在时才复制' },
      { name: '-d', description: '复制符号链接本身而不是其指向的文件' },
      { name: '-l, --link', description: '创建硬链接而不是复制文件内容' },
      { name: '-s, --symbolic-link', description: '创建符号链接（软链接）而不是复制' },
      { name: '--backup[=方式]', description: '覆盖前先对已存在的目标文件做备份' },
      { name: '-S 后缀', description: '指定备份文件的后缀（默认 ~）' }
    ],
    examples: [
      { command: 'cp file.txt /tmp/', description: '复制 file.txt 到 /tmp/ 目录' },
      { command: 'cp file.txt newfile.txt', description: '复制文件并重命名' },
      { command: 'cp -r project/ /backup/', description: '递归复制整个 project 目录到 /backup/' },
      { command: 'cp -a project/ /backup/project-$(date +%Y%m%d)', description: '归档模式完整备份目录，保留权限和时间戳' },
      { command: 'cp -iv src/*.py /opt/app/', description: '交互式复制所有 Python 源文件，显示详情' },
      { command: 'cp -u src/*.js dist/', description: '只复制比目标新的源文件（增量更新）' },
      { command: 'cp -rn src/ /backup/src/', description: '递归复制但不覆盖已存在的文件' },
      { command: 'cp -r --backup=numbered /data /backup/data', description: '复制目录，对已存在目标创建编号备份' }
    ],
    seeAlso: ['mv', 'rm', 'rsync', 'scp', 'ln']
  },
  {
    name: 'mv',
    category: '文件管理',
    description: '移动或重命名文件和目录。在同一文件系统内移动是原子操作且不复制数据（极快），跨文件系统则复制后删除。',
    syntax: 'mv [选项]... 源... 目标',
    options: [
      { name: '-v, --verbose', description: '显示每个移动操作的详细信息' },
      { name: '-i, --interactive', description: '覆盖目标文件前询问确认' },
      { name: '-f, --force', description: '强制覆盖，不提示' },
      { name: '-n, --no-clobber', description: '不覆盖已存在的目标文件' },
      { name: '-u, --update', description: '只在源文件比目标文件新或目标不存在时才移动' },
      { name: '-b, --backup', description: '覆盖前先对已存在的目标文件做备份' },
      { name: '-S 后缀', description: '指定备份文件的后缀' },
      { name: '-t, --target-directory=目录', description: '指定目标目录（所有源参数移动到此目录）' }
    ],
    examples: [
      { command: 'mv oldname.txt newname.txt', description: '将文件 oldname.txt 重命名为 newname.txt' },
      { command: 'mv file.txt /tmp/', description: '将文件移动到 /tmp/ 目录' },
      { command: 'mv dir1/ /opt/', description: '移动整个目录到 /opt/ 下' },
      { command: 'mv -iv file1.txt file2.txt /data/', description: '交互式移动多个文件，显示详情' },
      { command: 'mv -n *.png /data/images/', description: '移动所有 PNG 图片但不覆盖目标位置已存在的文件' },
      { command: 'mv -b important.txt backup/', description: '移动文件，若 backup/ 已存在同名文件则先备份' },
      { command: 'mv file{1,2}.txt', description: '使用花括号将 file1.txt 改名为 file2.txt' },
      { command: 'mv /tmp/*.log /var/log/old/', description: '移动 /tmp 下所有 .log 文件到归档目录' }
    ],
    seeAlso: ['cp', 'rm', 'rename', 'ln']
  },
  {
    name: 'rm',
    category: '文件管理',
    description: '删除文件或目录。删除后无法恢复（Linux 无回收站机制），请谨慎使用，尤其带 -rf 选项时。',
    syntax: 'rm [选项]... [文件]...',
    options: [
      { name: '-r, -R, --recursive', description: '递归删除目录及其所有内容（删除目录必须用）' },
      { name: '-f, --force', description: '强制删除，不提示任何确认，忽略不存在的文件' },
      { name: '-i, --interactive', description: '删除每个文件前都询问确认（安全模式）' },
      { name: '-I', description: '删除超过 3 个文件或递归删除前询问一次（比 -i 更实用）' },
      { name: '-v, --verbose', description: '显示每个删除操作的详细信息' },
      { name: '-d, --dir', description: '删除空目录（等同于 rmdir）' },
      { name: '--preserve-root', description: '禁止对根目录 / 执行递归删除（默认开启）' },
      { name: '--no-preserve-root', description: '允许删除根目录（极度危险，切勿使用）' }
    ],
    examples: [
      { command: 'rm file.txt', description: '删除单个文件' },
      { command: 'rm -v *.log', description: '删除当前目录所有 .log 文件并显示详情' },
      { command: 'rm -i important.txt', description: '交互式删除，确认后才执行' },
      { command: 'rm -rf old_project/', description: '强制递归删除整个目录（最常用但最危险的组合）' },
      { command: 'rm -Irf /tmp/*', description: '删除 /tmp 下所有内容，删除前询问一次确认' },
      { command: 'rm -d empty_dir/', description: '删除空目录' },
      { command: 'find /var/log -name "*.log.1" -type f -exec rm -v {} +', description: '与 find 配合安全地删除旧的轮转日志' }
    ],
    seeAlso: ['rmdir', 'cp', 'mv', 'find', 'shred']
  },
  {
    name: 'head',
    category: '文本处理',
    description: '输出文件的开头部分。默认显示前 10 行，可自定义行数或字节数，与 tail 相对应。',
    syntax: 'head [选项]... [文件]...',
    options: [
      { name: '-n, --lines=N', description: '显示前 N 行（默认 10 行），可直接使用 -N 简写' },
      { name: '-c, --bytes=N', description: '显示前 N 字节，支持 K/M/G 后缀如 -c 1K' },
      { name: '-q, --quiet, --silent', description: '处理多个文件时不显示文件名标题' },
      { name: '-v, --verbose', description: '总是显示文件名标题' },
      { name: '-n -N', description: '显示除最后 N 行以外的所有内容' }
    ],
    examples: [
      { command: 'head file.txt', description: '显示文件前 10 行' },
      { command: 'head -n 20 file.txt', description: '显示文件前 20 行' },
      { command: 'head -20 file.txt', description: '简写形式，同 -n 20' },
      { command: 'head -c 1K large.log', description: '显示大文件前 1KB 内容' },
      { command: 'head -n -5 file.txt', description: '显示文件除最后 5 行之外的所有内容' },
      { command: 'head -v file1.txt file2.txt', description: '同时显示多个文件并展示文件名标题' },
      { command: 'cat access.log | head -n 100 | grep 404', description: '只对日志前 100 行进行 grep 搜索' }
    ],
    seeAlso: ['tail', 'less', 'cat', 'sed', 'wc']
  },
  {
    name: 'less',
    category: '文本处理',
    description: '功能强大的终端分页查看器。比 more 更先进（支持向前翻页、搜索、高亮等），是查看大文件和命令输出的标准工具。',
    syntax: 'less [选项]... [文件]...',
    options: [
      { name: '-N, --LINE-NUMBERS', description: '显示行号' },
      { name: '-S, --chop-long-lines', description: '长行不换行而是截断显示（查看宽表格时很有用）' },
      { name: '-i, --ignore-case', description: '搜索时忽略大小写（除非搜索模式含大写字母）' },
      { name: '-I, --IGNORE-CASE', description: '搜索时完全忽略大小写' },
      { name: '-M, --LONG-PROMPT', description: '在底部显示详细的状态提示（行号、进度百分比等）' },
      { name: '+F', description: '启动后立即进入跟随模式（类似 tail -f，按 Ctrl+C 退出跟随）' },
      { name: '+G', description: '启动后直接跳转到文件末尾' },
      { name: '-R, --RAW-CONTROL-CHARS', description: '支持 ANSI 颜色转义序列（显示带颜色的日志）' },
      { name: '-g, --hilite-search', description: '只高亮最近一次搜索匹配（性能更好）' },
      { name: '-p 模式', description: '启动后立即搜索指定模式并跳转到第一个匹配' }
    ],
    examples: [
      { command: 'less /var/log/syslog', description: '分页查看系统日志' },
      { command: 'less -N /etc/nginx/nginx.conf', description: '查看配置文件并显示行号' },
      { command: 'less +F /var/log/nginx/error.log', description: '以跟随模式打开日志（实时看新增内容）' },
      { command: 'less -R /var/log/app/color.log', description: '支持 ANSI 颜色显示带色日志' },
      { command: 'less -S large_table.csv', description: '查看表格 CSV，长行截断不换行（左右方向键滚动）' },
      { command: 'dmesg | less -N', description: '通过管道查看内核消息并显示行号' },
      { command: 'less -p "error" app.log', description: '打开日志文件后立即定位到第一个 error 匹配处' },
      { command: 'grep -rn "TODO" ./src | less -N', description: '将搜索结果送入 less 分页浏览' }
    ],
    seeAlso: ['more', 'cat', 'head', 'tail', 'most']
  },
  {
    name: 'sort',
    category: '文本处理',
    description: '对文本行进行排序。支持按字段、数值、逆序、去重等多种排序方式，是数据处理管道中的常用工具。',
    syntax: 'sort [选项]... [文件]...',
    options: [
      { name: '-r, --reverse', description: '逆序排序（降序，默认升序）' },
      { name: '-n, --numeric-sort', description: '按数值大小排序（默认按字典序，10 会排在 2 前面）' },
      { name: '-h, --human-numeric-sort', description: '按人类可读数值排序（识别 K/M/G/T 后缀）' },
      { name: '-u, --unique', description: '去重，相同行只保留一行（排序后）' },
      { name: '-k, --key=字段定义', description: '按指定字段排序，如 -k2 按第 2 列，-k3,3n 第 3 列数值排序' },
      { name: '-t, --field-separator=分隔符', description: '指定字段分隔符（默认空白字符）' },
      { name: '-f, --ignore-case', description: '排序时忽略大小写' },
      { name: '-o, --output=文件', description: '将结果写入指定文件（可安全覆盖输入文件）' },
      { name: '-c, --check', description: '只检查文件是否已排序，不输出排序结果' },
      { name: '-V, --version-sort', description: '按版本号自然排序（如 1.10 > 1.2）' }
    ],
    examples: [
      { command: 'sort names.txt', description: '按字典序对文件行进行升序排序' },
      { command: 'sort -r names.txt', description: '按字典序降序排序' },
      { command: 'sort -n numbers.txt', description: '按数值大小排序（避免字典序问题）' },
      { command: 'du -sh * | sort -h', description: '按文件大小人类可读格式排序（小到大）' },
      { command: 'du -sh * | sort -hr', description: '按文件大小降序排序（大到小，最常用）' },
      { command: 'sort -u words.txt', description: '排序并去除重复行' },
      { command: 'sort -t: -k3 -n /etc/passwd', description: '以冒号分隔，按第 3 列（UID）数值排序用户列表' },
      { command: 'sort -k5,5rn data.csv', description: '按第 5 列数值逆序排序' },
      { command: 'ls -la | sort -k5 -n', description: '按文件大小（第 5 列）数值排序列表' },
      { command: 'sort -V version_list.txt', description: '按版本号正确排序（1.2, 1.10, 2.0 顺序正确）' }
    ],
    seeAlso: ['uniq', 'awk', 'cut', 'wc', 'comm']
  },
  {
    name: 'uniq',
    category: '文本处理',
    description: '去除或报告相邻的重复行。通常先配合 sort 使用，因为 uniq 只能检测相邻重复（不连续的重复去不掉）。',
    syntax: 'uniq [选项]... [输入 [输出]]',
    options: [
      { name: '-c, --count', description: '在每行前显示出现次数' },
      { name: '-d, --repeated', description: '只显示重复出现的行（每个重复行只显示一次）' },
      { name: '-D, --all-repeated', description: '显示所有重复的行（每个重复行都显示）' },
      { name: '-u, --unique', description: '只显示唯一的、不重复的行' },
      { name: '-i, --ignore-case', description: '比较时忽略大小写' },
      { name: '-f N, --skip-fields=N', description: '比较时跳过前 N 个字段' },
      { name: '-s N, --skip-chars=N', description: '比较时跳过前 N 个字符' },
      { name: '-w N, --check-chars=N', description: '只比较每行前 N 个字符' }
    ],
    examples: [
      { command: 'sort file.txt | uniq', description: '先排序后去重（去除所有重复行）' },
      { command: 'sort file.txt | uniq -c', description: '统计每行出现的次数（最常用组合）' },
      { command: 'sort file.txt | uniq -c | sort -rn', description: '统计每行出现次数并按次数降序排序（词频统计）' },
      { command: 'sort file.txt | uniq -d', description: '只显示有重复的行' },
      { command: 'sort file.txt | uniq -u', description: '只显示完全不重复的行（只出现过一次的）' },
      { command: 'cat access.log | awk \'{print $1}\' | sort | uniq -c | sort -rn | head -20', description: '统计访问日志中 IP 出现次数，显示前 20 个高频 IP' },
      { command: 'cat words.txt | sort -f | uniq -i', description: '忽略大小写去重' }
    ],
    seeAlso: ['sort', 'wc', 'awk', 'grep', 'comm']
  },
  {
    name: 'cut',
    category: '文本处理',
    description: '从每行文本中提取指定的部分内容（按字符位置、字节或字段）。适合处理简单的结构化文本。',
    syntax: 'cut [选项]... [文件]...',
    options: [
      { name: '-b, --bytes=列表', description: '按字节位置选择，如 -b1-3,5,7-' },
      { name: '-c, --characters=列表', description: '按字符位置选择（多字节字符安全）' },
      { name: '-f, --fields=列表', description: '按字段选择（需配合 -d 指定分隔符，默认 Tab）' },
      { name: '-d, --delimiter=分隔符', description: '指定字段分隔符（默认 Tab）' },
      { name: '--complement', description: '反向选择，提取不匹配的部分' },
      { name: '-s, --only-delimited', description: '不输出不包含分隔符的行' }
    ],
    examples: [
      { command: 'cut -d: -f1 /etc/passwd', description: '以冒号分隔，提取第 1 列（所有用户名）' },
      { command: 'cut -d: -f1,6 /etc/passwd', description: '提取用户名和主目录两列' },
      { command: 'cut -d: -f3-5 /etc/passwd', description: '提取第 3 到 5 列（UID、GID、用户说明）' },
      { command: 'cut -c1-10 long_lines.txt', description: '提取每行前 10 个字符' },
      { command: 'cut -c5- long_lines.txt', description: '提取每行从第 5 个字符开始到末尾的内容' },
      { command: 'cut -d\' \' -f1 access.log', description: '以空格分隔，提取访问日志第 1 列（通常是客户端 IP）' },
      { command: 'grep "POST" access.log | cut -d\'"\' -f2', description: '提取 POST 请求的 URL 路径' },
      { command: 'echo "Hello World" | cut -d\' \' -f1', description: '管道方式提取第一个词（Hello）' }
    ],
    seeAlso: ['awk', 'sed', 'paste', 'join', 'tr']
  },
  {
    name: 'ping',
    category: '网络工具',
    description: '通过 ICMP 协议测试与目标主机的网络连通性，测量往返延迟和丢包率。是最基础也是最常用的网络诊断工具。',
    syntax: 'ping [选项]... 目标主机',
    options: [
      { name: '-c 次数', description: '发送指定次数的请求后停止（默认一直发送，按 Ctrl+C 停止）' },
      { name: '-i 间隔', description: '设置相邻请求的间隔秒数（默认 1 秒）' },
      { name: '-s 大小', description: '设置发送的数据包大小（字节，默认 56）' },
      { name: '-t TTL', description: '设置 IP TTL 值' },
      { name: '-W 超时', description: '设置等待响应的超时秒数' },
      { name: '-q, --quiet', description: '安静模式，只在开始和结束时输出摘要' },
      { name: '-4', description: '强制使用 IPv4' },
      { name: '-6', description: '强制使用 IPv6' },
      { name: '-n', description: '不做 DNS 反向解析，直接显示 IP' }
    ],
    examples: [
      { command: 'ping 8.8.8.8', description: '测试与 Google DNS 的连通性（Ctrl+C 停止）' },
      { command: 'ping -c 4 google.com', description: '发送 4 次 ping 请求后自动停止并显示统计' },
      { command: 'ping -c 100 -i 0.2 192.168.1.1', description: '快速 ping 网关 100 次，间隔 0.2 秒（压力测试）' },
      { command: 'ping -c 5 -s 1400 vpn-server.example.com', description: '发送 1400 字节的大包测试 MTU 问题' },
      { command: 'ping -qn -c 100 10.0.0.1', description: '安静模式 ping 100 次，不解析主机名' },
      { command: 'ping -6 ipv6.google.com', description: '使用 IPv6 进行 ping 测试' }
    ],
    seeAlso: ['traceroute', 'mtr', 'nc', 'ss', 'netstat']
  }
]
