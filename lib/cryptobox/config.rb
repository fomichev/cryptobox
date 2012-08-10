#require 'pp'
require 'date'

module Cryptobox
  class Config
    VERSION = "0.5"

    attr_accessor :defines

    def initialize(path)
      paths = path ? [ path ] : [ '.cryptoboxrc.yml', '~/.cryptoboxrc.yml' ]
      paths = paths.select {|f| File.exist? f }

      @defines = load_config(paths.first)
#      pp @defines
    end

    def config_value(d, c, var, default='')
      group, variable = var.split(/\./)

      if c.has_key? group and c[group].has_key? variable
        d[var] = c[group][variable]
      else
        d[var] = default
      end
    end

    def [](var)
      return defines[var]
    end

    def load_config(path)
#      puts "load config #{path}"

      d = {}
      c = path ? YAML.load_file(path) : {}

      config_value d, c, 'ui.jquery_ui_theme', 'flick'
      config_value d, c, 'ui.default_password_length', '16'
      config_value d, c, 'ui.lock_timeout_minutes', '5'
      config_value d, c, 'ui.editor', 'gvim -n -f'
      config_value d, c, 'ui.lang', 'en'

      config_value d, c, 'cryptobox.version', VERSION
      config_value d, c, 'cryptobox.date_format', '%H:%M %d.%m.%Y'
      config_value d, c, 'cryptobox.date', DateTime.now.strftime(d['cryptobox.date_format'])

      config_value d, c, 'path.root', Dir.pwd
      config_value d, c, 'path.db', d['path.root'] + '/private'
      config_value d, c, 'path.db_cipher', d['path.db'] + '/cryptobox'
      config_value d, c, 'path.db_conf', d['path.db_cipher'] + '.yml'
      config_value d, c, 'path.db_json', d['path.db_cipher'] + '.json'
      config_value d, c, 'path.db_html', d['path.db'] + '/html/cryptobox.html'
      config_value d, c, 'path.db_mobile_html', d['path.db'] + '/html/m.cryptobox.html'
      config_value d, c, 'path.db_chrome', d['path.db'] + '/chrome'
      config_value d, c, 'path.db_chrome_cfg', d['path.db'] + '/chrome/cfg.js'
      config_value d, c, 'path.db_include', d['path.db'] + '/include'
      config_value d, c, 'path.tmp', d['path.db'] + '/tmp'
      config_value d, c, 'path.include', d['path.root'] + '/include'
      config_value d, c, 'path.html', d['path.root'] + '/html'
      config_value d, c, 'path.bookmarklet', d['path.root'] + '/bookmarklet'
      config_value d, c, 'path.chrome', d['path.root'] + '/chrome'
      config_value d, c, 'path.clippy', d['path.html'] + '/extern/clippy/build/clippy.swf'


      config_value d, c, 'path.jquery_ui_css_images', d['path.html'] + '/extern/jquery-ui/css/' + d['ui.jquery_ui_theme']
      config_value d, c, 'path.jquery_mobile_css_images', d['path.html'] + '/extern/jquery-mobile/'

      config_value d, c, 'path.db_bookmarklet_form', d['path.db'] + '/bookmarklet/form.js'
      config_value d, c, 'path.db_bookmarklet_fill', d['path.db'] + '/bookmarklet/fill.js'

      config_value d, c, 'backup.path', d['path.db'] + '/cryptobox.tar'
      config_value d, c, 'backup.files', [
                   d['path.db_cipher'],
                   d['path.db_hmac'],
                   d['path.db_html'],
                   d['path.db_conf'],
                   d['path.db_json'],
                   d['path.db_html'],
                   d['path.clippy'] ]

      # todo: add text (lang)

      return d
    end
  end
end
