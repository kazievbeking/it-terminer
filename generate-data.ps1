$ErrorActionPreference = 'Stop'
$base = $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
function SaveJson($path, $value) { $full = Join-Path $base $path; [IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($full)) | Out-Null; [IO.File]::WriteAllText($full, (ConvertTo-Json -InputObject $value -Depth 12), $utf8) }
$translations = @'
dictionary|Терминдер сөздігі|Словарь терминов|Term dictionary
research|Жасалу жолдары және зерттеу|Образование и исследование|Formation & research
quiz|Өзіңді тексер|Проверь себя|Test yourself
eyebrow|ТІЛ · ТЕХНОЛОГИЯ · ТАНЫМ|ЯЗЫК · ТЕХНОЛОГИИ · ЗНАНИЯ|LANGUAGE · TECHNOLOGY · DISCOVERY
headline|Технология тілі. Қазақша.|Язык технологий. На казахском.|Technology speaks Kazakh.
subtitle|Қазақ тіліндегі IT терминдердің жасалуы мен қолданысы|Образование и употребление IT-терминов на казахском языке|How Kazakh IT terms are formed and used
intro|Бір ұғым — бірнеше атау. Қазақша IT терминдерін зерттеп, үш тілдегі баламаларын салыстырыңыз.|Одно понятие — несколько названий. Изучайте казахские IT-термины и сравнивайте эквиваленты на трёх языках.|One concept, several names. Explore Kazakh IT terms and connect their equivalents across three languages.
explore|Терминдерді зерттеу ↗|Изучить термины ↗|Explore terms ↗
three|ҮШ ТІЛ. БІР МАҒЫНА.|ТРИ ЯЗЫКА. ОДИН СМЫСЛ.|THREE LANGUAGES. ONE MEANING.
notice|Алдын ала оқу нұсқасы. Бастапқы DOCX берілмеген: зерттеу сандары мен атау жұптары тапсырмадан алынды. Анықтамалар мен қосымша терминдер — оқу материалы.|Предварительная учебная версия. Исходный DOCX не предоставлен: цифры и пары взяты из задания. Определения и дополнительные термины — учебный материал.|Preliminary learning edition. The source DOCX was not supplied: figures and pairs come from the brief. Definitions and additional terms are educational additions.
learn|ЗЕРТТЕУ|ИЗУЧЕНИЕ|EXPLORE
understand|ТҮСІНУ|ПОНИМАНИЕ|UNDERSTAND
practice|БЕКІТУ|ПРАКТИКА|PRACTICE
dictionaryHint|Атауды таңдаңыз — мағынасын ашыңыз.|Выберите карточку, чтобы узнать больше.|Choose a card to discover its meaning.
search|Үш тілде іздеу…|Поиск на трёх языках…|Search in three languages…
all|Барлық тәсілдер|Все способы|All methods
lexical|Лексика-семантикалық|Лексико-семантический|Lexical-semantic
morphological|Морфологиялық|Морфологический|Morphological
syntactic|Синтаксистік|Синтаксический|Syntactic
transcription|Транскрипция / транслитерация|Транскрипция / транслитерация|Transcription / transliteration
calque|Калькалау|Калькирование|Calquing
unknown|Нақтылауды қажет етеді|Требует уточнения|Needs verification
method|Жасалу жолы|Способ образования|Formation method
found|термин табылды|терминов найдено|terms found
empty|Ештеңе табылмады. Іздеу сұрауын немесе сүзгіні өзгертіңіз.|Ничего не найдено. Измените запрос или фильтр.|No results. Try a different query or filter.
definition|Анықтама|Определение|Definition
variants|Қолданыс нұсқалары|Варианты употребления|Usage variants
example|Оқу мысалы|Учебный пример|Learning example
sources|Дереккөздер|Источники|Sources
brief|Тапсырмадағы мысал|Пример из задания|Example from the brief
addition|Қосымша оқу термині|Дополнительный учебный термин|Additional learning term
dataStatus|Анықтама мен аудармалар әзірлеу кезінде қосылды. Ресми мәртебе мен жіктеу DOCX бойынша тексерілген жоқ.|Определение и переводы добавлены при разработке. Официальный статус и классификация по DOCX не проверены.|Definitions and translations were added during development. Official status and source classification have not been verified against the DOCX.
overlap|Тәсілдер өзара қабаттасуы мүмкін. Төменде жалпы оқу түсіндірмелері берілген; бастапқы зерттеудің жіктеуі әлі тексерілмеген.|Способы могут пересекаться. Ниже даны общие учебные пояснения; классификация исходной работы ещё не проверена.|Methods can overlap. These are general learning explanations; the study's classifications have yet to be verified.
illustration|Оқу иллюстрациясы|Учебная иллюстрация|Learning illustration
classificationNote|Бұл зерттеу құжатынан расталған жіктеу емес.|Это не подтверждённая по исследованию классификация.|This classification has not been confirmed against the study.
survey|Атаулар қалай қолданылады?|Какие названия используют?|Which names do people use?
surveyContext|Тапсырмада келтірілген зерттеу деректері: 483 қатысушы, 2025 жылғы 2–15 желтоқсан. Тәуелсіз тексеру жүргізілген жоқ.|Данные исследования, приведённые в задании: 483 участника, 2–15 декабря 2025 года. Независимая проверка не проводилась.|Study figures quoted in the brief: 483 participants, 2–15 December 2025. No independent verification was performed.
mouseChart|Mouse · атаулардың қолданысы|Mouse · употребление названий|Mouse · name usage
diskChart|Hard disk · қазақша атаулар|Hard disk · казахские названия|Hard disk · Kazakh names
noKazakh|Қазақша нұсқаны қолданбайды|Не используют казахский вариант|Do not use a Kazakh name
rounding|Mouse тобының қосындысы — 100,1%. Тапсырмадағы 0,1 пайыздық тармақ айырмасы өзгертілмеді.|Сумма группы mouse — 100,1%. Расхождение в 0,1 процентного пункта из задания сохранено.|Mouse figures total 100.1%. The brief's 0.1 percentage point discrepancy is preserved.
comparisonNote|Тапсырмада берілген жұптар. DOCX жоқ болғандықтан, қай баған Termincom.kz-ке немесе оқулыққа тиесілі екені белгіленбеді. Бұл жаңа сайт тексеруінің нәтижесі емес.|Пары из задания. Без DOCX принадлежность колонок Termincom.kz или учебникам не установлена. Это не результат новой проверки сайтов.|Pairs from the brief. Without the DOCX, columns cannot be attributed to Termincom.kz or textbooks. These are not results of a new website review.
quizIntro|Бес сұрақ. Үш тілдегі баламаларды бекітіңіз. Әр жауаптан кейін түсіндірме беріледі.|Пять вопросов на эквиваленты. После каждого ответа — короткое пояснение.|Five questions to practise equivalents. Each answer comes with a short explanation.
quizReady|Дайынсыз ба? Бір ұғымның қазақша баламасын табыңыз.|Готовы? Найдите казахский эквивалент понятия.|Ready? Find the Kazakh equivalent of each concept.
start|Тестті бастау →|Начать тест →|Start quiz →
question|Сұрақ|Вопрос|Question
chooseEquivalent|Қазақша баламасын таңдаңыз:|Выберите казахский эквивалент:|Choose the Kazakh equivalent:
correct|Дұрыс!|Верно!|Correct!
incorrect|Қайта қарап көріңіз.|Посмотрите на эквиваленты.|Review the equivalents.
equivalentExplanation|Бұлар бір ұғымның үш тілдегі атаулары. Басқа қолданыс нұсқалары болуы мүмкін.|Это названия одного понятия на трёх языках. Возможны другие варианты употребления.|These names refer to one concept in three languages. Other usage variants may exist.
next|Келесі сұрақ →|Следующий вопрос →|Next question →
finish|Нәтижені көру →|Показать результат →|See result →
result|Нәтиже|Результат|Result
lastResult|Соңғы нәтиже|Последний результат|Last result
resultHint|Сөздікке оралып, жаңа ұғымдарды зерттеңіз.|Вернитесь в словарь и изучите новые понятия.|Return to the dictionary to explore more terms.
retry|Қайта өту ↻|Пройти ещё раз ↻|Try again ↻
footer|Тіл мен технологияны байланыстыратын шағын оқу жобасы.|Небольшой учебный проект о языке и технологиях.|A small learning project connecting language and technology.
close|Жабу|Закрыть|Close
loadError|Деректер жүктелмеді. Бетті жаңартыңыз.|Не удалось загрузить данные. Обновите страницу.|Data could not be loaded. Refresh the page.
'@
$langs=@('kk','ru','en'); $maps=@(@{},@{},@{})
foreach($line in ($translations -split "`r?`n")){ $p=$line.Split('|'); for($i=0;$i -lt 3;$i++){ $maps[$i][$p[0]]=$p[$i+1] } }
for($i=0;$i -lt 3;$i++){ SaveJson "locales/$($langs[$i]).json" $maps[$i] }
$rows=@'
Тінтуір|Мышь|Mouse|тышқан|Меңзерді басқаруға арналған құрылғы.|Устройство для управления указателем.|A device for controlling the pointer.
Пернетақта|Клавиатура|Keyboard||Мәтін мен пәрмен енгізетін құрылғы.|Устройство для ввода текста и команд.|A device for entering text and commands.
Қатты диск|Жёсткий диск|Hard disk|қатқыл диск|Деректерді ұзақ сақтайтын құрылғы.|Устройство для длительного хранения данных.|A device for long-term data storage.
Бағдарламалық жасақтама|Программное обеспечение|Software|бағдарламалық қамтылым|Компьютерде орындалатын бағдарламалар жиынтығы.|Совокупность программ, выполняемых компьютером.|Programs that run on a computer.
Пәрмен|Команда|Command|команда|Жүйеге берілетін әрекет нұсқауы.|Инструкция системе выполнить действие.|An instruction for a system to perform an action.
Құпиясөз|Пароль|Password|пароль|Қолжетімділікті тексеруге арналған құпия таңбалар.|Секретная последовательность для проверки доступа.|A secret sequence used to verify access.
Қапшық|Папка|Folder|бума|Файлдарды ұйымдастыруға арналған орын.|Место для организации файлов.|A location used to organise files.
Қоржын|Корзина|Recycle bin|себет|Жойылған файлдарды уақытша сақтайтын орын.|Место временного хранения удалённых файлов.|A temporary location for deleted files.
Теңшеу|Настройка|Settings|баптау|Бағдарлама параметрлерін өзгерту.|Изменение параметров программы.|Adjusting a program's preferences.
Амалдық жүйе|Операционная система|Operating system|операциялық жүйе|Құрылғы ресурстарын басқаратын негізгі бағдарламалар.|Основные программы, управляющие ресурсами устройства.|Core software that manages device resources.
Файл|Файл|File||Атауы бар сақталған деректер бірлігі.|Именованная единица сохранённых данных.|A named unit of stored data.
Желі|Сеть|Network||Дерек алмасатын құрылғылар байланысы.|Связь устройств для обмена данными.|Connected devices that exchange data.
Дерекқор|База данных|Database||Құрылымдалған деректер жиынтығы.|Организованный набор данных.|An organised collection of data.
Сілтеме|Ссылка|Link||Басқа ресурсқа өтуге арналған мекенжай.|Адрес для перехода к другому ресурсу.|A reference leading to another resource.
Браузер|Браузер|Browser||Веб-беттерді ашатын бағдарлама.|Программа для просмотра веб-страниц.|A program for viewing web pages.
Сервер|Сервер|Server||Басқа құрылғыларға қызмет ұсынатын жүйе.|Система, предоставляющая услуги другим устройствам.|A system that provides services to other devices.
Алгоритм|Алгоритм|Algorithm||Есепті шешуге арналған қадамдар реті.|Последовательность шагов решения задачи.|A sequence of steps for solving a problem.
Жады|Память|Memory||Деректерді сақтайтын компьютер ресурсы.|Ресурс компьютера для хранения данных.|A computer resource for holding data.
Процессор|Процессор|Processor||Бағдарлама нұсқауларын орындайтын бөлік.|Компонент, выполняющий инструкции программы.|A component that executes program instructions.
Экран|Экран|Screen||Көрнекі ақпарат көрсетілетін бет.|Поверхность для отображения информации.|A surface that displays visual information.
Жүктеу|Загрузка|Download||Деректерді құрылғыға алу әрекеті.|Получение данных на устройство.|Transferring data to a device.
Жаңарту|Обновление|Update||Бағдарламаны жаңа нұсқаға ауыстыру.|Переход программы на новую версию.|Replacing software with a newer version.
Электрондық пошта|Электронная почта|Email||Желі арқылы электрондық хат алмасу.|Обмен электронными письмами через сеть.|Exchanging electronic messages over a network.
Бұлттық сақтау|Облачное хранилище|Cloud storage||Деректерді қашықтағы жүйеде сақтау.|Хранение данных в удалённой системе.|Keeping data on a remote system.
Қолданба|Приложение|Application||Белгілі міндетті орындайтын бағдарлама.|Программа для определённой задачи.|Software designed for a specific task.
Деректер|Данные|Data||Өңдеуге немесе сақтауға болатын ақпарат.|Информация для обработки или хранения.|Information that can be processed or stored.
'@
$terms=@();$n=0
foreach($line in ($rows -split "`r?`n")){ $p=$line.Split('|');$n++;$terms+=@{id=$n;kk=$p[0];ru=$p[1];en=$p[2];variants=@($p[3].Split(';') | Where-Object {$_});methods=@('unknown');origin=$(if($n -le 10){'brief'}else{'addition'});definition=@{kk=$p[4];ru=$p[5];en=$p[6]};example=@{kk="Бұл сабақта «$($p[0])» ұғымын қарастырамыз.";ru="В этом задании мы изучаем понятие «$($p[1])».";en="In this activity we explore the concept of $($p[2])."}} }
SaveJson 'data/terms.json' $terms
$methodRows=@'
lexical|Күнделікті сөзге арнайы техникалық мағына беріледі.|Обычное слово получает специальное техническое значение.|An existing word takes on a specialised technical meaning.|желі
morphological|Жұрнақ арқылы жаңа атау жасалады.|Новое название образуется с помощью аффикса.|An affix is used to form a new term.|қолданба
syntactic|Бірнеше сөз бірігіп, бір ұғымды атайды.|Несколько слов вместе обозначают одно понятие.|Multiple words combine to name one concept.|қатты диск
transcription|Өзге тілдегі атаудың дыбысталуы немесе жазылуы бейімделеді.|Звучание или написание иноязычного термина адаптируется.|The sound or spelling of a borrowed term is adapted.|сервер
calque|Атаудың құрамдас бөліктері аударылады.|Составные части названия переводятся.|The components of a term are translated.|бұлттық сақтау / cloud storage
'@
$methods=@();foreach($line in ($methodRows -split "`r?`n")){$p=$line.Split('|');$methods+=@{id=$p[0];explanation=@{kk=$p[1];ru=$p[2];en=$p[3]};example=$p[4]}}
SaveJson 'data/research.json' @{source='User brief; original DOCX not supplied';methods=$methods; pairs=@(@('Қоржын','Себет'),@('Қапшық','Бума'),@('Пәрмен','Команда'),@('Құпиясөз','Пароль'),@('Теңшеу','Баптау'),@('Амалдық жүйе','Операциялық жүйе'));charts=@(@{title='mouseChart';rows=@(@{label='мышка';value=62.9},@{label='тышқан';value=21},@{label='тінтуір';value=16.2})},@{title='diskChart';rows=@(@{key='noKazakh';value=60.8},@{label='қатты диск';value=24.9},@{label='қатқыл диск';value=14.3})})}
